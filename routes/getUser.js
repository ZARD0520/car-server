var express= require('express')
var Admin = require('../models/user')
var md5 = require('blueimp-md5')

var router = express.Router()