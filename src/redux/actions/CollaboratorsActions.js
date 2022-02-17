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

export const createCollaboratorRedux = (collaborator, userId, oldCollaborators, allCollaboratorsRecentyAdded) => async dispatch => {

  // Siempre debo crear el COLLABORATOR. Es unico por role y track.
  let collaboratorFromBackend = await BackendCommunication.createCollaboratorFuga(collaborator, dispatch);
  if (collaboratorFromBackend === "ERROR") return "ERROR";

  // Si la PERSON que es el colaborador, ya existia en FS, no la vuelvo a crear.
  let collaboratorToCreateExisted = oldCollaborators.find(oldC => oldC.name === collaborator.name);
  if (collaboratorToCreateExisted && collaboratorToCreateExisted.name === collaborator.name) return "SUCCESS";

  // Si la PERSON con otro role, ya la agregue a FS.
  let collaboratRecentlyAdded = allCollaboratorsRecentyAdded.find(recentlyC => (recentlyC.name === collaborator.name) && recentlyC.added);
  console.log("RECENTLY ADDED ALL: ", allCollaboratorsRecentyAdded, "/ Was recently added: ", collaboratRecentlyAdded);
  if (collaboratRecentlyAdded) return "SUCCESS";

  collaborator.whenCreatedTS = new Date().getTime();
  collaborator.lastUpdateTS = collaborator.whenCreatedTS;
  delete collaborator.role; delete collaborator.fugaId; delete collaborator.trackFugaId;

  console.log("COLLABORATOR NEW: ", collaborator);

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

const getPersonIdFromPeople = (peopleWithId, personName) => {
  let result = peopleWithId.find(person => person.name === personName);
  if (result && result.id) return result.id;
}

const getAllCollaboratorsToAttachFromUploadingTracks = (uploadedTracks, peopleWithId, ownerId) => {
  console.log("PERSONS FROM BE: ", peopleWithId);
  console.log("COLL FROM TRACKS : ", uploadedTracks);
  let collaboratorsForEachTrack = [];
  uploadedTracks.forEach(track => {
    track.collaborators.forEach(coll => {
      if (coll.name !== "") {
        coll.roles.forEach(collRol => {
          collaboratorsForEachTrack.push({
            trackFugaId: track.fugaId, id: uuidv4(), added: false,
            ownerId, name: coll.name, role: collRol, person: getPersonIdFromPeople(peopleWithId, coll.name)
          });
        })
      }
    })
  });
  return collaboratorsForEachTrack;
}

export const createCollaboratorsRedux = (tracksCreated, ownerId, oldCollaborators) => async dispatch => {

  const peopleToCreateFormData = createPersonsModel(getAllPeopleToCreateFromUploadingTracks(tracksCreated));
  let peopleFromBackend = await BackendCommunication.createPersonsFuga(peopleToCreateFormData, dispatch, oldCollaborators);
  if (peopleFromBackend === "ERROR") return "ERROR";

  let allCollaboratorsNotEmptyTracks = getAllCollaboratorsToAttachFromUploadingTracks(tracksCreated, peopleFromBackend, ownerId);
  const createOtherCollaboratorsOneByOne = allCollaboratorsNotEmptyTracks.map(async dataCollaborator => {
    let collaboratorCreatedResult = await toWithOutError(dispatch(createCollaboratorRedux(dataCollaborator, ownerId, oldCollaborators, allCollaboratorsNotEmptyTracks)));
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

  return "SUCCESS";
}