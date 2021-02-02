import firebase_admin
import math
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('patientdata_auth.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

batch = db.batch()
counter = 0

for i in items:
	ref = db.collection('data').document()

	#FIXING THE RACES
	race_sum = i["race_teal"] + i["race_blue"] + i["race_purple"] + i["race_green"]

	i["race_teal"] = i["race_teal"] / race_sum
	i["race_blue"] = i["race_blue"] / race_sum
	i["race_purple"] = i["race_purple"] / race_sum
	i["race_green"] = i["race_green"] / race_sum

	max = max([i["race_teal"], i["race_blue"], i["race_purple"], i["race_green"]])

	if i["race_teal"] == max:
		i["race"] = "Teal"
	elif i["race_blue"] == max:
		i["race"] = "Blue"
	elif i["race_purple"] == max:
		i["race"] = "Purple"
	else:
		i["race"] = "Green"


	#FIXING THE AGE
	i["age"] = math.floor(i["age"])
	#FIXING THE SEX
	i["sex"] = "male" if i["sex"] else "female"


	batch.set(ref, i)
	counter += 1

	if counter == 20:
		counter = 0
		batch.commit()

		batch = db.batch()
