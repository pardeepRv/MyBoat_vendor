import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { config } from './configProvider';


class NotificationProvider {
  oneSignalNotificationSendCall(notification_arr) {
    if (notification_arr != 'NA') {
      console.log('notification_arr_check iff');
      console.log('notification_arr.length', notification_arr.length);
      for (let i = 0; i < notification_arr.length; i++) {
        let title = notification_arr[i].title;
        let message = notification_arr[i].message;
        let action_json = notification_arr[i].action_json;
        let player_id = notification_arr[i].player_id;
        let contents = { 'en': message };
        let data = { 'action_json': action_json };
        // Make sure to send an String Array of playerIds
        let playerIds = [player_id];
        var other = {
          headings: { en: title },
          group: 10,
          priority: 10,
        };
        OneSignal.postNotification(contents, data, playerIds, other);

        console.log('player_id', player_id)
        console.log('action_json', action_json)
        console.log('massege', message)
        console.log('title', title)
      }
    }
  
  }


  //  notification.notificationfunction(obj.notification_arr[0].message, obj.notification_arr[0].action_json, obj.notification_arr[0].player_id, obj.notification_arr[0].title)
  oneSignalNotificationSendCall1(notification_arr) {
    console.log('oneSignalNotificationSendCall', notification_arr);
    if (notification_arr != 'NA') {
      console.log('notification_arr_check iff');
      console.log('notification_arr.length', notification_arr.length);
      for (let i = 0; i < notification_arr.length; i++) {
        // alert('hello');
        let player_id_arr = [];
        player_id_arr.push(notification_arr[i].player_id);
        if (player_id_arr.length > 0) {
          let title = notification_arr[i].title;
          let message = notification_arr[i].message;
          let action_json = notification_arr[i].action_json;

          let contents = { 'en': message };
          let data = { 'action_json': action_json };
          var other = {
            headings: { en: title },
            group: 10,
            priority: 10,
          };
          console.log('contents', contents);
          console.log('other', other);
          console.log('data', data);
          const notificationObj = {
            contents: contents,
            include_player_ids: player_id_arr,
            data: data,
            other: other,
          };
          const jsonString = JSON.stringify(notificationObj);
          OneSignal.postNotification(jsonString, (success) => {
            console.log("Success:", success);
          }, (error) => {
            console.log("Error:", error);
          });
        }
      }
    }
  }
}

export const notification = new NotificationProvider();
