import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	console.log(messages);

	useEffect(() => {
		socket.on('message', receiveMessage);

		return () => {
			socket.off('message', receiveMessage);
		};
	}, []);

	const receiveMessage = (message) => setMessages((prevState) => [...prevState, message]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const newMessage = {
			body: message,
			from: 'Me',
		};

		setMessages([...messages, newMessage]);
		socket.emit('message', message);
	};

	const handleChange = (e) => {
		setMessage(e.target.value);
	};

	const renderMessages = () => {
		return messages.map((message, index) => {
			console.log(message);
			const { body, from } = message;
			if (body === undefined || body === null || body === '' || from === undefined || from === null || from === '')
				return;

			return (
				<li
					key={index}
					className={`my-1 p-2 table text-sm rounded-md ${from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black ml-auto'}`}>
					<span className='block text-xs text-slate-300'>{from}</span>
					<span className='text-base'>{body}</span>
				</li>
			);
		});
	};

	return (
		<div className='h-screen bg-zinc-800 text-white flex items-center justify-center '>
			<form onSubmit={handleSubmit} className='bg-zinc-900 py-5 px-10 rounded-md'>
				<h1 className='text-center text-3xl mb-4 font-bold tracking-wide'>React Chat</h1>
				<input
					type='text'
					placeholder='Write your message😋'
					onChange={handleChange}
					className='border-2 border-zinc-500 p-2 w-full rounded-md text-neutral-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
				/>
				<ul className='my-4'>{renderMessages()}</ul>
			</form>
		</div>
	);
}

export default App;
