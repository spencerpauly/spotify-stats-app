# About This Project
This project was created to allow users to view a top-chart of their most listened to spotify tracks and artists. From there it grew to allow all the tracks to be downloaded into a playlist and will hopefully continue to grow to show more detailed and more informative spotify statistics to users.

## How to run

```
npm start
```

## How to build/deploy

Get PID of process currently running on port:
```
lsof -i :3000
```
Kill process:
```
kill <pid>
```
Start new spotify statistics process:
```
setsid npm start -l 3001
```
* CTRL+L to break from GUI


## Potential bugs/security risks
Must make sure spotify public/private key is not commmitted to git repository.

## Future todo

## Other

### Credentials
I have removed my personal credentials from the server.js file, but if you add your own credentials and run the project, this project should be fairly easy to replicate.

## Developer's Note
This project was an entirely new concept for me. It incorporated JQuery, Ajax, HTML, CSS, Bootstrap, Javascript, UI & UX Design, NodeJS, and working with an API, many of which were entirely new technologies for me. I think this project was important, though, because I just went in and for the first time I felt like I had enough background knowledge in general software development that I could pick up any new technology fairly easily, so this project was definately a testemant to that. Looking back I'm still not too happy with the final design. I tried many times to make the javascript class-based, and each time failed, so if I was to try this again I would probably seek to understand classes in a functional programming language a lot better. I felt like I had a lot of hard to maintain code, but possibly in the future I will come back to this project and clean it up when I'm more knowledgable.


