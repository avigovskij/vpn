import "./StartPage.scss"
import {useState} from "react";
import Modal from "../modal/Modal";
export default function StartPage() {
    const [showModal, setShowModal] = useState(false);
    const [url, setUrl] = useState("");
    function sendWSPaymentRequest() {
        const socket = new WebSocket("ws://10.8.0.1:8000/ton/transact/");
        socket.addEventListener("open", event => {
            socket.send("Connection established")
        });

        socket.addEventListener("message", event => {
            if (event.data) {
                const data = JSON.parse(event.data);
                setUrl(data.auth_link);
                setShowModal(true);
            }
        });
    }
    return (
        <div className="container">
            <div className="launch-button">
                <p>Для доступа к VPN<br/>нажмите на кнопку снизу</p>
                <button onClick={sendWSPaymentRequest}>
                    <img src="/turn-on.png" alt="turn on icon"/>
                </button>
            </div>

            <Modal active={showModal} setActive={setShowModal} url={url}/>
        </div>
    )
}
