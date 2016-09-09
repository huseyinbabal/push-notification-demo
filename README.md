# Push Notification Demo

- In `manifes.json` replace `GCM_ID` with yours.
- Run `npm install && npm start`
- Click "Enable Push Messages" and you will see subscription id. You will use this id in following step.

- Run `curl --header "Authorization: key=<API_KEY>" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"SUBSCRIPTION_ID\"]}"`
