import axios from 'axios';
import { copyFormDataToJSON, to } from '../utils';
import { createBackendError } from '../redux/actions/ErrorHandlerActions';
import { loginErrorStore } from 'redux/actions/AuthActions';
import { writeCloudLog } from './LoggingService';
import { logReleaseDeliveryAnalyticEvent } from './GoogleAnalytics';

export const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
export const localUrl = "http://localhost:5000/filemanagerapp/api/";
export const targetUrl = webUrl;

