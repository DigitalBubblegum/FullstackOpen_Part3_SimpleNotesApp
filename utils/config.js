require('dotenv').config()

const PORT = process.env.PORT
//do not save password in github
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
	MONGODB_URI,
	PORT,
}
