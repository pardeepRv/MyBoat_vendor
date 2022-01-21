import AsyncStorage  from "@react-native-async-storage/async-storage";

class localStorageProvider {
    setItemString(key, value) {
         try {
               AsyncStorage.setItem(key, value);
             } catch (error) {
               console.log('Error');
        }
    }

    getItemString(key) {
        var item = AsyncStorage.getItem(key);
        return item;
    }

    async setItemObject(key, item) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.log('Error');
        }
    }

    async getItemObject(key) {
        var item = await AsyncStorage.getItem(key);
        return JSON.parse(item);
    }

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Error ' + error.value);
        }
    }
}

export const localStorage = new localStorageProvider();


// localStorage.getItemString('name').then((result) => {
//     if (result !== null) {
//         alert("First: " + result);
//     } else {
//         alert("Not saved");
//     }
// });

// var user_id = 0;

// var user_arr = localStorage.getItemObject('user_arr').then((result) => {
//     if (result !== null) {
//         user_id = result.user_id;
//         //alert("user_id: " + result.user_id);
//     } else {
//       user_id = 0;
//         //alert("Not saved");
//     }
// });
