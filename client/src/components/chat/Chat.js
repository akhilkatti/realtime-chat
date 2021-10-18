import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../infobar/InfoBar';
import Input from '../input/Input';
import Messages from '../messages/Messages';
import TextContainer from '../textcontainer/TextContainer';

import './Chat.css';



let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);


    const ENDPOINT = 'https://retica-backend.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        
        socket = io(ENDPOINT);
        
        setName(name);
        setRoom(room);

        socket.emit('join',{ name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    },[ENDPOINT,location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    },[messages]);

    const sendMessage = ( event ) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages);


    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users}/>
        </div>
    )
}


export default Chat;