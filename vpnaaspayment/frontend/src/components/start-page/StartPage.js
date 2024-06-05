import "./StartPage.scss"
import {useState} from "react";
import Modal from "../modal/Modal";
import { Circles  } from 'react-loader-spinner'


const download = require('downloadjs');


export default function StartPage() {
    const [showModal, setShowModal] = useState(false);
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    function sendWSPaymentRequest() {
        const socket = new WebSocket("ws://localhost:9000/ton/transact/");
        socket.addEventListener("open", event => {
            socket.send("Connection established")
        });

        socket.addEventListener("message", event => {
            console.log("accepted message");
            if (event.data) {
                const data = JSON.parse(event.data);
                if (data.auth_link) {
                    setUrl(data.auth_link);
                    setShowModal(true);
                } else if (data.ovpn_file_content){
                    download(data.ovpn_file_content, "access.ovpn");
                    console.log('isDownloaded true!!!')
                    setIsDownloaded(true);
                    setShowModal(false);
                } else if (data.loader === false) {
                    setIsLoading(data.loader);
                }
            }
        });
    }

    const mainInfo = () => {
        return (
            <div className="launch-button">
                <p><b>Для полученя сертификата к VPN</b><br/><b>нажмите на кнопку снизу</b></p>
                <button onClick={sendWSPaymentRequest}>
                    <img src="/turn-on.png" alt="turn on icon"/>
                </button>
            </div>
        )
    }

    const downloadedMessage = () => {
        return (
            <div className="launch-button">
                <p><b>Поздравляем! Ваш .ovpn файл скачан. Проверьте файл access.ovpn.</b></p>
            </div>
        )
    }

    const loader = () => {
        return (
            <Circles>
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            </Circles>
        )
    }

    return (
        <div className="container">
            {isLoading ? loader() : (isDownloaded ? downloadedMessage(): mainInfo())}
            <Modal active={showModal} setActive={setShowModal} url={url}/>
        </div>
    )
}
