import { useState, useEffect } from 'react';
import { Form, Col, Button, Alert } from 'react-bootstrap';
import History from './history.jsx';

export default function Emitter({ emitToChannels, addEmitTo, emitData, emitHistory, clearHistory, stack }) {
  const [emitChannel, setEmitChannel] = useState('join-room');
  const [emitText, setEmitText] = useState('');
  const [emitDataJson, setEmittDataJson] = useState(true);
  const [newEmitter, setNewEmitter] = useState('');
  const [emitFormErrors, setEmitFormErrors] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [phaseNumber, setPhaseNumber] = useState('1');
  const [quizNumber, setQuizNumber] = useState('1');

  const handleChangeRoomId = (e) => {
    setRoomId(e.target.value);
  }

  const handleChangePhaseNumber = (e) => {
    setPhaseNumber(e.target.value);
  }

  const handleChangeQuizNumber = (e) => {
    setQuizNumber(e.target.value);
  }

  useEffect(() => {
    const defaultEmitText = {
      'join-room': `{"roomId":"${roomId}"}`,
      'answer-question': `{"roomId":"${roomId}", "answer":"", "currentQuizNumber":"${quizNumber}"}`,
      'leave-room': `{"roomId":"${roomId}"}`,
      'reply-for-plain-room-manual-check': `{"roomId":"${roomId}"}`,
      'socketio-client': 'hoge',
      'socketio-client-ack': 'hoge',
      'extend-life': '{}',
      'push-button': `{"roomId":"${roomId}", "time":0, "currentPhaseNumber":"${phaseNumber}", "currentQuizNumber":"${quizNumber}"}`,
    }

    setEmitText(defaultEmitText[emitChannel]);
  }, [emitChannel, roomId, phaseNumber, quizNumber]);

  const onEmitDataSubmit = (e) => {
    e.preventDefault();

    let dataToEmit = emitText;

    if (emitDataJson === true) {
      try {
        dataToEmit = JSON.parse(emitText);
      } catch (error) {
        // setEmitFormErrors((items) => [...items, `Failed to parse JSON data: ${error}`]);
        setEmitFormErrors(() => [`Failed to parse JSON data: ${error}`]);
        return;
      }
    }
    setEmitText(() => '');
    setEmitFormErrors(() => []);
    emitData(emitChannel, dataToEmit);
  }

  const onAddEmitterSubmit = (e) => {
    e.preventDefault();
    addEmitTo(newEmitter);
    setNewEmitter('');
    setEmitChannel(() => newEmitter);
  }

  const eventOptions = emitToChannels.map((item) => {
    return (
      <option key={item} value={item}>{item}</option>
    );
  });

  return (
    <>
      <div>
        RoomId: <input className="mb-3" onChange={handleChangeRoomId} value={roomId} autoFocus />
      </div>
      <div>
        currentPhaseNumber: <input className="mb-3" onChange={handleChangePhaseNumber} value={phaseNumber} />
      </div>
      <div>
        currentQuizNumber: <input className="mb-3" onChange={handleChangeQuizNumber} value={quizNumber} />
      </div>
      <div>
        <Form onSubmit={onAddEmitterSubmit} className="mb-3">
          <Form.Row>
            <Col xs={4}>
              <Form.Control size="sm" value={newEmitter} onChange={(e) => setNewEmitter(e.target.value)} placeholder="Event name" />
            </Col>
            <Col xs={2}>
              <Button size="sm" variant="info" type="submit" block>Add</Button>
            </Col>
          </Form.Row>
        </Form>

        <hr />

        <Form onSubmit={onEmitDataSubmit}>
          <Alert variant="danger" show={emitFormErrors.length > 0}>
            {emitFormErrors.join(', ')}
          </Alert>
          <Form.Row className="mb-2">
            <Col>
              <Form.Control as="select" value={emitChannel} onChange={(e) => setEmitChannel(e.target.value)}>
                {eventOptions}
              </Form.Control>
            </Col>
            <Col>
              <Form.Check type="switch" id="is-json" label="JSON data" value={emitDataJson} checked={emitDataJson} onChange={(e) => setEmittDataJson(() => e.target.checked)} placeholder="data..." className="pt-3 pl-5" />
            </Col>
          </Form.Row>
          <Form.Row className="mb-2">
            <Col>
              <Form.Control as="textarea" value={emitText} onChange={(e) => setEmitText(e.target.value)} />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Button variant="success" type="submit" block>Emit</Button>
            </Col>
          </Form.Row>
        </Form>

        <hr />
        <div className="mt-4">
          <History data={emitHistory} emitBack={emitData} title="Messages" clearHistory={clearHistory} stack={stack} />
        </div>
      </div>
    </>
  );
}