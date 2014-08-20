User.create(username:"j-wad", name:"Jouad", email:"jouad@yahoo.com", address:"633 Folsom St.", latitude:37.784919, longitude:-122.397443)
Survey.create(title:"Yes or No")
Question.create(content:"Do you like cheese?", survey_id:1)
Response.create(content:"no", user_id:1, question_id:1)