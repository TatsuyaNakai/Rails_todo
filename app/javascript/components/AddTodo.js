import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend } from "react-icons/fi";

const InputAndButton = styled.div`
	display: flex;
	justfy-content: space-between;
	margin-top: 20px;
`;

const InputName = styled.input`
	font-size: 20px;
	width: 100%;
	height: 40px;
	padding: 2px 7px;
`;

const Button = styled.button`
	font-size: 20px;
	border: none;
	border-radius: 3px;
	margin-left: 10px;
	padding: 2px 10px;
	background: #1e90ff;
	color: #fff;
	text-align: center;
	cursor: pointer;
	${({ disabled }) =>
		disabled &&
		`
		opacity:0.5;
		cursor:default;
	`}
`;

const Icon = styled.span`
	display: flex;
	align-items: center;
	margin: 0.7px;
`;

toast.configure();

export default function AddTodo(props) {
	const initialTodoState = {
		id: null,
		name: "",
		is_completed: false,
	};

	const [todo, setTodo] = useState(initialTodoState);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setTodo({ ...todo, [name]: value });
	};

	const notify = () => {
		toast.success("Todo successfully created!", {
			// 数秒間だけ表示されるモーダル、第一引数には、表示する文字列を書く
			position: "bottom-center",
			hideProgressBar: true,
			// 第2引数には、設定を加える。
			// 今回でいうと表示する場所と、下に表示されるバーを表示しない(○%とかのやつ)
		});
	};

	const saveTodo = () => {
		let data = {
			name: todo.name,
		};
		// idは自動的に入るし、is_completedは初期値がfalseになるから、入力してない。

		axios
			.post("/api/v1/todos", data)
			// rails routesからhttpsメソッドを確認する。
			.then((res) => {
				setTodo({
					id: res.data.id,
					name: res.data.name,
					is_completed: res.data.is_completed,
				});
				notify();
				props.history.push("/todos");
				// /todosにページ遷移する動き
			})
			.catch((e) => {
				console.log(e);
			});
	};

	return (
		<>
			<h1>New Todo</h1>
			<InputAndButton>
				<InputName
					type="text"
					required
					value={todo.name}
					name="name"
					onChange={handleInputChange}
				/>
				<Button
					onClick={saveTodo}
					disabled={!todo.name || /^\s*$/.test(todo.name)}
					// 何も入ってない場合=>false, !が付いてて、trueになる。=> disabledがtrue=>ボタン押せない。
					// testは、入力した値とオブジェクト（手前の正規表現）が通過するかどうか。通過すればtrueを返す。
					// 正規表現は、空白文字で始まって終わる（中身も空白文字を繰り返すだけ）いわゆる空白
				>
					<Icon>
						<FiSend />
					</Icon>
				</Button>
			</InputAndButton>
		</>
	);
}
