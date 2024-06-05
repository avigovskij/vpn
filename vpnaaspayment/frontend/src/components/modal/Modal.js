import "./Modal.scss";

export default function Modal({active, setActive, url}) {
    return (
        <div className={ active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <button onClick={() => setActive(false)}><img src="/close.png" alt="close icon"/></button>
                </div>
                <iframe className="auth-frame" src={url}></iframe>
            </div>
        </div>
    )
}
