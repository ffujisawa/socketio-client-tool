import { useState, useEffect } from 'react';
import { Form, Col, Button, Alert } from 'react-bootstrap';

export default function Connection({ connData, createConnection, eventsToListenFor, emitTo }) {
  const [formValid, setFormValid] = useState([]);
  const [serverUrl, setServerUrl] = useState([]);
  const [config, setConfig] = useState();

  const onFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      JSON.parse(config);
    } catch (e) {
      console.log('cannot parse config json', e);
      setFormValid(() => [e]);
      return;
    }

    setFormValid(() => []);
    createConnection(serverUrl, config);
  }

  useEffect(() => {
    setConfig(() => connData.config);
    setServerUrl(() => connData.server);
  }, [connData]);

  return (
    <>
      <Alert variant="danger" show={(connData.errors).length > 0 || formValid.length > 0}>
        {connData.errors.join(', ')} {formValid.join(', ')}
      </Alert>

      <Form className="mb-4" onSubmit={onFormSubmit}>
        <Form.Row className="mb-2">
          <Col>
            <Form.Control required value={serverUrl} placeholder="server url" type="url" onChange={(e) => setServerUrl(e.target.value)} />
          </Col>
        </Form.Row>
        <Form.Row className="mb-2">
          <Col>
            <Form.Control as="textarea" placeholder="JSON config" value={config} onChange={(e) => setConfig(e.target.value)} />
          </Col>
        </Form.Row>
        <Form.Row className="mt-2">
          <Col>
            <Form.Text className="mb-2">
              <strong>Listen to</strong>: {eventsToListenFor.join(', ')} <strong>Emit to</strong>: {emitTo.join(', ')}
            </Form.Text>
            <Button variant="success" type="submit" block disabled={connData.loading}>{connData.loading ? 'Connecting...' : 'Connect'}</Button>
          </Col>
        </Form.Row>
      </Form>
    </>
  )
}
