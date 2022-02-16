import { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true
});

// 低機能, ただフォームにある内容で request 送るだけ
// バックエンドから set-cookie してもらってください
const RequestForm = ({props}) => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8083/auth/login');
  const [body, setBody] = useState(JSON.stringify({
    email: 'takuya@example.com',
    password: 'fujisawa-test'
  }));

  const [method, setMethod] = useState('POST');

  const onFormSubmit = async(e) => {
    e.preventDefault();

    switch (method) {
        case 'GET':
            await axiosInstance.get(serverUrl);
            break;
        case 'POST':
            await axiosInstance.post(serverUrl, JSON.parse(body));
            break;
        default:
            return;
    }
  }

  return (
    <>
      <Form onSubmit={onFormSubmit}>
        <Form.Text className="mb-2">
            <h4>↓ request 送れます, set-cookie してもらってください</h4>
        </Form.Text>
        <Form.Text className="mb-2">
            <small>POST 以外動くかわからないです</small>
        </Form.Text>
        <Form.Control className="mb-2" as="select" aria-label="methods" value={method} onChange={(e) => setMethod(e.target.value)} >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
        </Form.Control>
        <Form.Row className="mb-2">
          <Col>
            <Form.Control required placeholder="server url" type="url" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
          </Col>
        </Form.Row>
        <Form.Row className="mb-2">
          <Col>
            <Form.Control as="textarea" placeholder="body (JSON)" value={body} onChange={(e) => setBody(e.target.value)} />
          </Col>
        </Form.Row>
        <Form.Row className="mt-2">
          <Col>
            <Form.Text className="mb-2">
              <p>ほとんど機能用意しないので開発者ツールと併用してください</p>
            </Form.Text>
            <Button variant="success" type="submit" block >Send</Button>
          </Col>
        </Form.Row>
      </Form>
    </>
  )
}

export default RequestForm
