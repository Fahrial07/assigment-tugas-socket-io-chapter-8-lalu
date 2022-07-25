import Head from 'next/head'
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import { io } from "socket.io-client";
import Navbar from './components/navbar';


const socket = io.connect('http://localhost:8000');

export default function Home() {

  const router = useRouter();

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [join, setJoin] = useState(false);


  const handleJoin = (e) => {
      e.preventDefault();
      console.log(name, room);
      if(room !== "") {
        socket.emit('join_a_room', room );
        setJoin(true);

        localStorage.setItem('name', name);
        localStorage.setItem('room', room);
        localStorage.setItem('join', join);

        router.push('playing', undefined, { shallow: false })
      } else {
          router.push('/', undefined, { shallow: false })
      }
    }

     const removeLocal = () => {
          localStorage.removeItem('name');
          localStorage.removeItem('room');
          localStorage.removeItem('join');
     }

    useEffect(
      ()  => {
          removeLocal()
      }, []
    );



  return (
    <div>
      <Head>
        <title>Join Now to Fight | Home</title>
      </Head>

      <Navbar />

      <div className="container-fluid" style={{ minHeight: 100+"vh", backgroundColor: "#34B3F1;" }}>
      <div className="row">
        <div className="col-lg-12">
            <div>
                <h2 className="fw-bold text-center mt-5 text-white">Tebak Gambar</h2>
            </div>
          <div className="d-flex align-items-center justify-content-center mt-5">
                <div className="card col-lg-5">
                  <div className="card-header bg-dark">
                      <h5 className="card-title text-center text-white fw-bold">Join Now to Fight</h5>
                  </div>
                  <div className="card-body align-middle">
                    <form onSubmit={handleJoin} method="post">
                        <div className="form-group mb-2">
                          <label htmlFor="name">Your Name</label>
                          <input type="text" name="name" className="form-control mt-2" id="name" onChange={ (e) => {setName(e.target.value)}} />
                        </div>
                        <div className="form-group mb-2">
                          <label htmlFor="room">Room</label>
                          <input type="text" name="room" className="form-control mt-2" id="room" onChange={ (e) => {setRoom(e.target.value)}} />
                        </div>
                        <div className="form-group mb-2 mt-3 d-grid gap-2">
                          <button className="btn btn-success btn-sm fw-bold">Join Now</button>
                        </div>
                    </form>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
