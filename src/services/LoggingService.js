import { getFunctions, httpsCallable } from "firebase/functions";
import { to } from 'utils';

const functions = getFunctions();

export const writeCloudLog = async (msg, payloadData, payloadError, typeOfLog) => {
  const onCallWriteCloudLog = httpsCallable(functions, 'logs-onCallWriteCloudLog');
  const [errorWritingLog] = await to(onCallWriteCloudLog({ msg, payloadData, payloadError, typeOfLog }));

  if (errorWritingLog) return "ERROR";
  
  return "SUCCESS";
}