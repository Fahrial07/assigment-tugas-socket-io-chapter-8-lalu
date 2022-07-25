import Head from 'next/head'
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { io } from "socket.io-client";
import Navbar from '../components/navbar';


const socket = io.connect('http://localhost:8000');

export default function Playing()
{

        const getRandomItem = (arr) => {
            const randomIndex = Math.floor(Math.random() * arr.length);
            const item = arr[randomIndex];
            return item;
        }

        const dataImages = [
            {
                "id": 1,
                "image": "images/alaskaki.jpg",
                "key": "Alas Kaki"
            },
            {
                "id": 2,
                "image": "images/aslimanado.jpg",
                "key": "Asli Manado"
            },
            {
                "id": 3,
                "image": "images/bantinggitar.jpg",
                "key": "Banting Gitar"
            }
        ];

        const router = useRouter();

        const [start, setStart] = useState(false);

        const [skor, setSkor] = useState(0);
        const [answer, setAnswer] = useState('');
        const [key, setKey] = useState('');
        const [name, setName] = useState('');
        const [room, setRoom] = useState('')
        const [images, setImages] = useState([]);
        const [datas, setDatas] = useState([]);

        function randImage(){
            const result = getRandomItem(dataImages);
            setImages(result);
        }

        const handleStart = (e) => {
             e.preventDefault();
            //  console.log('start');
            localStorage.setItem('start', 'yes')
            const st = localStorage.getItem('start');
            setStart(st);
            randImage();
            setKey(images.key);
        }

        const handleSubmit = (e) => {
            e.preventDefault();

                randImage();
                setKey(images.key);

                if(answer == key){
                    console.log('benar');
                    setSkor(skor + 1);
                    console.log(skor);
                }

                const dataPlayer = {
                    name: name,
                    room: room,
                    skor: skor
                }
                // console.log(dataPlayer);
                 socket.emit('send_data', dataPlayer);
                 setDatas(() => [dataPlayer])
            }


        useEffect(() => {

            const name = localStorage.getItem('name')
            const room = localStorage.getItem('room')
            const st = localStorage.getItem('start');
            setStart(st);
            setName(name);
            setRoom(room);

            randImage();
            setKey(images.key);

            socket.on('received_data', (data) => {
                setDatas(() => [data]);
            })

            if(name && room == "") {
                router.push('/', undefined, { shallow: false })
            }

            }, [socket])

            console.log(datas);

    return(
        <div>
            <Head>
                <title>Playing</title>
            </Head>

            <Navbar />
            <div className="container-fluid bg-secondary">
                <div className="row">
                    <div className="col-lg-12">
                            {start !== 'yes' ? (

                                <div className="d-flex align-items-center justify-content-center m-5" style={{minHeight: 549+"px;"}}>
                                    <button onClick={handleStart} type="button" className="btn btn-warning fw-bold text-dark">START GAME</button>
                                </div>


                                ) : (

                        <div className="row m-5">


                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-header bg-warning">
                                        <h3 className="card-title fw-bold text-center text-dark">INFORMASI</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="row align-items-center text-center">
                                            <div className="col">
                                                <h4 className="fw-bold">{name}</h4>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row align-items-center text-center">
                                            <div className="col">
                                                <h5 className="fw-bold">Room</h5>
                                            </div>
                                            <div className="col">
                                                <h5 className="fw-bold">:</h5>
                                            </div>
                                             <div className="col">
                                                <h4 className="fw-bold">{room}</h4>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row align-items-center text-center">
                                            <div className="col">
                                                <h6 className="fw-bold">SKOR KAMU</h6>
                                            </div>
                                            <div className="col">
                                                <h6 className="fw-bold">SKOR LAWAN</h6>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row align-items-center text-center">
                                            <div className="col">
                                                <h1 className="fw-bold">{skor}</h1>
                                            </div>
                                            <div className="col">
                                                <h1 className="fw-bold">0</h1>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row align-items-center text-center">
                                            <div className="col">
                                                <h4 className="fw-bold">PLAYER</h4>
                                                {datas.map((data, index) => (
                                                <div key={index}>
                                                    {data.room == room ? (
                                                        <h5>{data.name}</h5>
                                                    ) : ('')}
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-8">

                                <div className="row d-flex align-items-center justify-content-center">
                                    <div className="card">
                                        <div className="card-body h-100">
                                            <div className="row d-flex align-items-center justify-content-center">
                                              <img src={images.image} className="img-fluid p-5" style={{ maxWidth: 50 +"%" }} alt="" />

                                            </div>
                                            <form className="row g-3">
                                                <div className="form-group mb-3">
                                                    <input name="answer" className="form-control" onChange={(e) => setAnswer(e.target.value)}/>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <button type="submit" onClick={handleSubmit} className="btn btn-success btn-sm">Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}

                    </div>
                </div>
            </div>
        </div>
    );

}