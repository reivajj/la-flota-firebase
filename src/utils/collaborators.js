import { v4 as uuidv4 } from 'uuid';

export const deleteWeirdCharacters = text => {
  return text.normalize('NFD')
    .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
    .normalize();
}

export const getAllPeopleToCreateFromUploadingTracks = uploadedTracks => {
  let people = [];
  uploadedTracks.forEach(track => {
    track.collaborators.forEach(coll => {
      if (!coll.personExistsInFuga && !people.map(p => p.name).includes(coll.name)) people.push({ name: coll.name });
    })
  });
  return people;
}

const getPersonIdFromPeople = (peopleWithId, personName) => {
  let peopleWiIdNotNull = peopleWithId.filter(person => person !== null && person.id !== null);
  let result = peopleWiIdNotNull.find(person =>
    deleteWeirdCharacters(person.name.toLowerCase()) === deleteWeirdCharacters(personName.toLowerCase()));
  if (result && result.id !== "") return result.id;
}

export const getAllCollaboratorsToAttachFromUploadingTracks = (uploadedTracks, peopleWithId, ownerId, ownerEmail) => {
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