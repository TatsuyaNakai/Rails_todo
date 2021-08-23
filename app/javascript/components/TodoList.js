import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { AiFillEdit } from "react-icons/ai";

const SearchAndButton = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const SearchForm = styled.input`
	font-size: 20px;
	width: 100%;
	height: 40px;
	margin: 10px 0;
	padding: 10px;
`;

const RemoveAllButton = styled.button`
	width: 16%;
	height: 40%;
	background: #f54242;
	border: none;
	font-weight: 500;
	margin-left: 10px;
	padding: 5px 10px;
	border-radius: 3px;
	color: #fff;
	cursor: pointer;
`;

const TodoName = styled.span`
	font-size: 27px;
	${({ is_completed }) =>
		is_completed &&
		`
    opacity: 0.4;
  `}
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 7px auto;
	padding: 10px;
	font-size: 25px;
`;

const CheckedBox = styled.div`
	display: flex;
	align-items: center;
	margin: 0 7px;
	color: green;
	cursor: pointer;
`;

const UncheckedBox = styled.div`
	display: flex;
	align-items: center;
	margin: 0 7px;
	cursor: pointer;
`;

const EditButton = styled.span`
	display: flex;
	align-items: center;
	margin: 0 7px;
`;

export default function TodoList() {
	const [todos, setTodos] = useState([]);
	const [searchName, setSearchName] = useState("");

	useEffect(() => {
		axios
			.get("/api/v1/todos.js")
			// rails routesでみると、httpsメソッドがGETで書かれてる。
			// それから()内とURIを確認して、アクションを確認する。
			.then((res) => {
				setTodos(res.data);
				// そこで取得したデータをsetTodosに格納する。
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	const removeAllTodos = () => {
		const sure = window.confirm("Are you sure?");
		if (sure) {
			axios
				.delete("/api/v1/todos/destroy_all")
				// rails routesでみると、httpsメソッドがDELETEで書かれてる。
				// それから()内とURIを確認して、アクションを確認する。
				.then((res) => {
					setTodos([]);
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};

	const updateIsCompleted = (index, val) => {
		let data = {
			id: val.id,
			name: val.name,
			is_completed: !val.is_completed,
		};
		axios
			.patch(`/api/v1/todos/${val.id}`, data)
			// 配列の更新はここで完了してる。
			.then((res) => {
				const newTodos = [...todos];
				// 配列を展開
				newTodos[index].is_completed = res.data.is_completed;
				// 何番目かは第一引数に書いてるから、その番手のものの属性値を格納する。
				setTodos(newTodos);
			});
	};

	return (
		<>
			<h1>Todo List</h1>
			<SearchAndButton>
				<SearchForm
					type="text"
					placeholder="Search todo"
					onChange={(event) => {
						setSearchName(event.target.value);
					}}
				/>
				<RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
			</SearchAndButton>

			<div>
				{todos
					.filter((val) => {
						// 検索窓の部分
						if (searchName === "") {
							return val;
							// 何も入力されてない時は、全部のvalを返却する。
						} else if (
							val.name.toLowerCase().includes(searchName.toLowerCase())
							// 入力された文字を含んでるvalを返却する。
						) {
							return val;
						}
					})
					.map((val, key) => {
						// ふるいにかけられた結果のvalが返却される。mapで羅列する。
						return (
							<Row key={key}>
								{val.is_completed ? (
									// 以下三項演算子でcheckboxの反応を変える。
									<CheckedBox>
										<ImCheckboxChecked
											onClick={() => updateIsCompleted(key, val)}
										/>
									</CheckedBox>
								) : (
									<CheckedBox>
										<ImCheckboxUnchecked
											onClick={() => updateIsCompleted(key, val)}
										/>
									</CheckedBox>
								)}
								<TodoName is_completed={val.is_completed}>{val.name}</TodoName>
								{/* 属性が変わると、cssが変わる。=>色が薄くなる。 */}
								<Link to={"/todos/" + val.id + "/edit"}>
									{/* それぞれのURLに対応してルーティングすることができる。 */}
									<EditButton>
										<AiFillEdit />
									</EditButton>
								</Link>
							</Row>
						);
					})}
			</div>
		</>
	);
}
