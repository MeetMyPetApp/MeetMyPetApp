require('../config/db.config');
const axios = require('axios');

const User = require('../models/user.model');
const Pet = require('../models/pet.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const Match = require('../models/match.model');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

const faker = require('faker');
const { replaceOne } = require('../models/message.model');

const userIds = [];

//https://dog.ceo/api/breeds/list/all
//https://dog.ceo/api/breed/weimaraner/images/random


async function dogBreeds() {
    const data = await axios.get('https://dog.ceo/api/breeds/list/all')
      .then(function (response) {
        const breeds = response.data.message;
        return Object.keys(breeds);
      })
      .catch(function (error) {
        console.log(error);
      })

    return data
}

const breedsArr = [];
  

Promise.all([
    User.deleteMany(),
    Pet.deleteMany(),
    Post.deleteMany(),
    Comment.deleteMany(),
    Like.deleteMany(),
    Match.deleteMany(),
    Chat.deleteMany(),
    Message.deleteMany(),
    dogBreeds().then(resp => {
        breedsArr.push(resp)
        return resp
    })
    .catch(error => console.log(error))
    
])
    .then(() => {
        console.log('Database deleted!')

        for (let i = 0; i < 20; i++) {

            const userStatus = ['Pet looking for pet','Owner looking for friends', 'Owner looking for soulmate', 'Owner expanding network', 'Hey, I am using MeetMyPet']

            const user = new User({
                name: faker.name.findName(),
                email: faker.internet.email(),
                username: faker.internet.userName(),
                avatar: faker.image.avatar(),
                status: userStatus[Math.floor(Math.random() * userStatus.length)],
                bio: faker.lorem.sentence(),
                createdAt: faker.date.past()
            });

            user.save()
                .then(user => {
                    userIds.push(user._id);

                    const dogBreed = breedsArr[0][Math.floor(Math.random() * breedsArr[0].length)];

                    axios.get(`https://dog.ceo/api/breed/${dogBreed}/images/random`)
                            .then(resp => {
                                const dogImage = resp.data.message;

                                const pet = new Pet({
                                    user: user._id,
                                    name: faker.lorem.word(),
                                    avatar: dogImage,
                                    breed: dogBreed,
                                    available: 'Available',
                                    bio: faker.lorem.paragraph(),
                                    createdAt: faker.date.past()
                                });
            
                                pet.save()
            
                                const visibility = ['private','public'];
            
                                const post = new Post({
                                    user: user._id,
                                    visibility: visibility[Math.floor(Math.random() * 2)],
                                    body: faker.lorem.text(),
                                    createdAt: faker.date.past()
                                });
            
                                post.save()
                                    .then(p => {
            
                                        for (let j = 0; Math.floor(Math.random() * 10); j++) {
                                            const comment = new Comment({
                                                body: faker.lorem.paragraph(),
                                                user: userIds[Math.floor(Math.random() * userIds.length)],
                                                post: p._id,
                                                createdAt: faker.date.past()
                                            });
            
                                            comment.save();
                                        }
            
                                        for (let k = 0; Math.floor(Math.random() * 50); k++) {
                                            const like = new Like({
                                                user: userIds[Math.floor(Math.random() * userIds.length)],
                                                post: p._id,
                                                createdAt: faker.date.past()
                                            });
                    
                                            like.save();
                                        }
                                    })

                            })
                            .catch(function (error) {
                                console.log(error);
                            })

        
                })
                .catch(err => console.log(err));
                
        }

    })
    .then(() => {
        const testProfile = new User({
            name: 'Test',
            email: 'test@test.com',
            username: 'Test',
            avatar: faker.image.avatar(),
            password: 'Test1234',
            status: 'Owner expanding network',
            bio: faker.lorem.sentence(),
            activation: { active: true },
            createdAt: faker.date.past()
        });

        testProfile.save()
            .then(user => {
                console.log('Test profile: e-mail = test@test.com , password = Test1234');

                const dogBreed = breedsArr[0][Math.floor(Math.random() * breedsArr[0].length)];

                axios.get(`https://dog.ceo/api/breed/${dogBreed}/images/random`)
                    .then(resp => {
                        const dogImage = resp.data.message;

                        const pet = new Pet({
                            user: user._id,
                            name: 'Test pet',
                            avatar: dogImage,
                            breed: dogBreed,
                            available: 'Available',
                            bio: faker.lorem.paragraph(),
                            createdAt: faker.date.past()
                        });
    
                        pet.save().then(p  =>  console.log('Test pet saved: ', p))
                       

                        const visibility = ['private','public'];

                        for (let i = 0; i < 20; i++) {
                            const post = new Post({
                                user: profile._id,
                                visibility: visibility[Math.floor(Math.random() * 2)],
                                body: faker.lorem.text(),
                                createdAt: faker.date.past()
                            });

                            post.save()
                                .then(p => {
                                    for (let j = 0; Math.floor(Math.random() * 10); j++) {
                                        const comment = new Comment({
                                            body: faker.lorem.paragraph(),
                                            user: profile._id,
                                            post: p._id,
                                            createdAt: faker.date.past()
                                        });
                
                                        comment.save();
                                    }
                
                                    for (let k = 0; Math.floor(Math.random() * 50); k++) {
                                        const like = new Like({
                                            user: profile._id,
                                            post: p._id,
                                            createdAt: faker.date.past()
                                        });
                
                                        like.save();
                                    }   
                                })
                        }

                        for (let i = 0; i < 10; i++) {
                            const match = new Match({
                                requester: profile._id,
                                receiver: userIds[i],
                                status: 'accepted',
                                createdAt: faker.date.past()
                            })

                            match.save()

                            const chat = new Chat({
                                members: [profile._id, userIds[i]],
                                createdAt: faker.date.past()
                            })

                            chat.save()

                            for (let j = 0; j < 20; j++) {
                                const message = new Message({
                                    message: faker.lorem.paragraph(),
                                    sender: j % 2 === 0 ? profile._id : userIds[i],
                                    chat: chat._id,
                                    createdAt: faker.date.past()
                                })

                                message.save()
                            }
                        }

                    })


                
            })
    })
