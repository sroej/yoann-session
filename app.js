{
    "name": "yoann session",
    "description": "a session generator for yoann xmd-bot",
    "logo": "https://files.catbox.moe/mwmtbh.jpg",
    "repository": "https://github.com/denki-arch/YOANN-XMD",
    "keywords": ["YOANN-XMD BOT"],
    "success_url": "/", 
    "buildpacks": [{ "url": "https://github.com/heroku/heroku-buildpack-nodejs#latest" } ],
    "env": {      
      "PORT": {
        "description": "Port for web app.4000,5000,3000... any!",
        "value": "5000",
        "required": false 
      },
      "MESSAGE": {
        "description": "This site is only for session generating",
        "value": "",
        "required": false 
      }
    }   

}
