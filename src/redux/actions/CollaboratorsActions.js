import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { toWithOutError } from 'utils';
import { createPersonsModel } from 'services/CreateModels';
import { v4 as uuidv4 } from 'uuid';


export const addCollaborators = collaborators => {
  console.log("Collaborators: ", collaborators);
  return {
    type: ReducerTypes.ADD_COLLABORATORS,
    payload: collaborators
  };
};

export const collaboratorsSignOut = () => {
  return {
    type: ReducerTypes.COLLABORATORS_SIGN_OUT
  }
}

export const createCollaboratorRedux = (collaborator, userId) => async dispatch => {

  let collaboratorFromBackend = await BackendCommunication.createCollaboratorFuga(collaborator, dispatch);
  if (collaboratorFromBackend === "ERROR") return "ERROR";

  collaborator.whenCreatedTS = new Date().getTime();
  collaborator.lastUpdateTS = collaborator.whenCreatedTS;
  collaborator.ownerId = userId;
  collaborator.fugaId = collaboratorFromBackend;
  collaborator.id = uuidv4();

  console.log("COLLABORATOR BE:", collaborator);

  await FirestoreServices.createElementFS(collaborator, collaborator.id, userId, "artistsCollaborators", "totalCollaborators", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_COLLABORATORS,
    payload: [collaborator]
  });

  return collaborator;
}

const getAllPeopleToCreateFromUploadingTracks = uploadedTracks => {
  let people = [];
  uploadedTracks.forEach(track => {
    track.collaborators.forEach(coll => {
      if (!coll.personExistsInFuga && !people.map(p => p.name).includes(coll.name)) people.push({ name: coll.name });
    })
  });
  return people;
}

const getPersonIdFromPeople = (peopleWithId, personName) => peopleWithId.find(person => person.name === personName).id;

const getAllCollaboratorsToAttachFromUploadingTracks = (uploadedTracks, peopleWithId) => {
  let collaboratorsForEachTrack = [];
  uploadedTracks.forEach(track => {
    track.collaborators.forEach(coll => {
      if (coll.name !== "") {
        coll.roles.forEach(collRol => {
          collaboratorsForEachTrack.push({ trackFugaId: track.fugaId, name: coll.name, role: collRol, person: getPersonIdFromPeople(peopleWithId, coll.name) });
        })
      }
    })
  });
  return collaboratorsForEachTrack;
}

export const createCollaboratorsRedux = (tracksCreated, ownerId) => async dispatch => {

  const peopleToCreateFormData = createPersonsModel(getAllPeopleToCreateFromUploadingTracks(tracksCreated));
  let peopleFromBackend = await BackendCommunication.createPersonsFuga(peopleToCreateFormData, dispatch);
  if (peopleFromBackend === "ERROR") return "ERROR";
  console.log("PEOPLE FROM BE: ", peopleFromBackend);

  let allCollaboratorsNotEmptyTracks = getAllCollaboratorsToAttachFromUploadingTracks(tracksCreated, peopleFromBackend);
  const createOtherCollaboratorsOneByOne = allCollaboratorsNotEmptyTracks.map(async dataCollaborator => {
    let collaboratorCreatedResult = await toWithOutError(dispatch(createCollaboratorRedux(dataCollaborator, ownerId)));
    if (collaboratorCreatedResult === "ERROR") return "ERROR";
    return collaboratorCreatedResult;
  });

  let responseCreatingAllCollaborators = await toWithOutError(Promise.all(createOtherCollaboratorsOneByOne));
  if (responseCreatingAllCollaborators === "ERROR" || responseCreatingAllCollaborators.includes("ERROR")) {
    console.log("ERROR EN EL PROMISE ALL :", responseCreatingAllCollaborators);
    return "ERROR";
  }

  console.log("Success creando los collaborators en el album: ", responseCreatingAllCollaborators);
  console.log("Los collaborators despues de agregar todo: ", allCollaboratorsNotEmptyTracks);

  dispatch({
    type: ReducerTypes.ADD_COLLABORATORS,
    payload: allCollaboratorsNotEmptyTracks
  });

  return "SUCCESS";
}