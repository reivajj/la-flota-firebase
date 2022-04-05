import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { toWithOutError, copyFormDataToJSON } from 'utils';
import { createPersonsModel } from 'services/CreateModels';
import { v4 as uuidv4 } from 'uuid';
import { writeCloudLog } from '../../services/LoggingService';


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

export const createCollaboratorRedux = (collaborator, userId, ownerEmail) => async dispatch => {

  // Siempre debo crear el COLLABORATOR. Es unico por role y track.
  if (!collaborator.person) return "ERROR COLABORADOR ID FALTANTE";
  let collaboratorFromBackend = await BackendCommunication.createCollaboratorFuga(collaborator, ownerEmail, dispatch);
  if (collaboratorFromBackend === "ERROR") return "ERROR";

  collaborator.added = true;
  collaborator.ownerEmail = ownerEmail;
  collaborator.whenCreatedTS = new Date().getTime();
  collaborator.lastUpdateTS = collaborator.whenCreatedTS;

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
  console.log("PEOPLE PRE GETS: ", peopleWithId);
  let peopleWiIdNotNull = peopleWithId.filter(person => person !== null);
  let result = peopleWiIdNotNull.find(person => person.name.toLowerCase() === personName.toLowerCase());
  if (result && result.id) return result.id;
}

const getAllCollaboratorsToAttachFromUploadingTracks = (uploadedTracks, peopleWithId, ownerId, ownerEmail) => {
  let collaboratorsForEachTrack = [];
  uploadedTracks.forEach(track => {
    track.collaborators.forEach(coll => {
      if (coll.name !== "") {
        coll.roles.forEach(collRol => {
          collaboratorsForEachTrack.push({
            trackFugaId: track.fugaId, id: uuidv4(), added: false, ownerEmail, ownerId,
            name: coll.name, role: collRol, person: getPersonIdFromPeople(peopleWithId, coll.name)
          });
        })
      }
    })
  });
  return collaboratorsForEachTrack;
}

export const createCollaboratorsRedux = (tracksCreated, ownerId, ownerEmail) => async dispatch => {

  writeCloudLog(`creating people to send to fuga pre model, ownerEmail: ${ownerEmail}`, tracksCreated.map(t => t.collaborators), { notError: "not error" }, "info");
  
  const peopleToCreateFormData = createPersonsModel(getAllPeopleToCreateFromUploadingTracks(tracksCreated));

  writeCloudLog(`creating people to send to fuga post model, ownerEmail: ${ownerEmail}`, copyFormDataToJSON(peopleToCreateFormData), { notError: "not error" }, "info");

  let peopleFromBackend = await BackendCommunication.createPersonsFuga(peopleToCreateFormData, dispatch);
  if (peopleFromBackend === "ERROR") return "ERROR";

  writeCloudLog(`creating people post fuga pre collaborators, ownerEmail: ${ownerEmail}`, copyFormDataToJSON(peopleToCreateFormData), { notError: "not error" }, "info");

  let allCollaboratorsNotEmptyTracks = getAllCollaboratorsToAttachFromUploadingTracks(tracksCreated, peopleFromBackend, ownerId, ownerEmail);
  writeCloudLog(`all collaborators to attach post people fuga, ownerEmail: ${ownerEmail}`, allCollaboratorsNotEmptyTracks, { notError: "not error" }, "info");

  let responseCreatingAllCollaborators = [];
  for (const dataCollaborator of allCollaboratorsNotEmptyTracks) {
    let collaboratorCreatedResult = await toWithOutError(dispatch(createCollaboratorRedux(dataCollaborator, ownerId, ownerEmail)));
    if (collaboratorCreatedResult === "ERROR") return "ERROR";
    responseCreatingAllCollaborators.push(collaboratorCreatedResult);
  }

  console.log("Success creando los collaborators en el album: ", responseCreatingAllCollaborators);

  return "SUCCESS";
}