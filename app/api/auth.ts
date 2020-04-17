import axios from "axios";
import * as config from "../config";
import { endpointUrl, serverUrl } from "../config";
import { authHeader } from "./utils";
import type { User, UserProfile } from "../core/user";
import { axiosErrToMsg } from "../core/utils";
import { getUserProfilePm } from "./profile";

const storageKey = "user";

function storeUserPm(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    if (config.chromeExtension) {
      chrome.storage.local.set({ [storageKey]: user }, () => resolve());
    } else {
      if (typeof(Storage) !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(user));
        resolve();
      }
    }
  });
}

function deleteUserPm(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (config.chromeExtension) {
      chrome.storage.local.remove([storageKey], () => resolve());
    } else {
      window.localStorage.removeItem(storageKey);
      resolve();
    }
  });
}

export function retrieveUserPm(): Promise<[User, UserProfile]> {
  return new Promise((resolve, reject) => {
    if (config.chromeExtension) {
      chrome.storage.local.get(storageKey, result => {
        const mbUser: User|null = result[storageKey];
        if (!mbUser) {
          reject();
        } else {
          getUserProfilePm(mbUser).then(
            profile => resolve([mbUser, profile]),
              err => reject(err)
          );
        }
      });
    } else {
      const userStr = window.localStorage.getItem(storageKey);
      if (!userStr) {
        return reject();
      } else {
        try {
          const user: User = JSON.parse(userStr);
          getUserProfilePm(user).then(
            profile => resolve([user, profile]),
              err => reject(err)
          );
        } catch(err) { reject("Error parsing user object: " + err); }
      }
    }
  });
}

export function loginPm(): Promise<[User, UserProfile]> {
  return new Promise((resolve, reject) => {
    let popup: Window|null = null;

    function receiveMessage(event: MessageEvent): void {
      if (event.source === popup) {
        popup?.close();
        window.removeEventListener("message", receiveMessage);
        try {
          const user = JSON.parse(event.data) as User;
          //console.log("Logged user:");
          //console.log(user);
          storeUserPm(user).then(
            () => getUserProfilePm(user).then(
              profile => resolve([user, profile]),
              err => reject(err)
            )
          );
        } catch (err) { reject("Error parsing user object: " + err); }
      }
    }

    retrieveUserPm().then(
      res => resolve(res),
      () => {
        //if (config.chromeExtension) {
          //chrome.windows.create(
            //{ url: serverUrl + "/api/b2access/login", type: "popup", focused: false, width: 800, setSelfAsOpener: true} as any,
            //w => window.addEventListener("message", receiveMessage, false)
          //);
        //} else {
          popup = window.open(serverUrl + "/api/b2access/login", "B2ACCESS", "width=800");
          window.addEventListener("message", receiveMessage, false);
        //}
      }
    );
  });
}

export function logoutPm(): Promise<any> {
  return new Promise((resolve, reject) => {
    retrieveUserPm().then(
      ([user, userProfile]) => {
        deleteUserPm().then(
          () => axios.get(endpointUrl + "/logout", authHeader(user.accessToken))
            .then((resp) => resolve(resp))
            .catch(error => reject(axiosErrToMsg(error)))
        )
      },
      () => reject("Not logged in")
    );
  });
}