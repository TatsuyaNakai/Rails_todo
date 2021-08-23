### props がなぜ値を渡せているのか、何を渡しているのかがわかりませんでした。

/app/javascript/components/EditTodo.js における
関数コンポーネントの props が何を指しているのかわかりませんでした。
EditTodo コンポーネントを扱う App.js では、
Route タグの属性値にはパスと component={EditTodo}の記述だけでした。
debugger で確認したところ、History であったり、match のような全体を説明するようなものが格納されていました。

今までの props の感覚であれば親コンポーネントからもらう時には、

#### 親コンポーネントであれば、

import React from "react";
import ChildNode from "./components/ChildNode";

export default function App() {
return (
<div>
<ChildNode title="りんご" />
</div>
);
}

#### 子コンポーネントにて

import React from "react";

export default function ChildNode(props) {
return (
<div>
<h1>{props.title}</h1>
</div>
);
}

で受け取っていましたが、今回は何も明示せずに渡しているので、わかりませんでした。
component 属性について調べましたが、表示するコンポーネントを指定しているのみなのかなというところでした。

久しぶりの React で知識が抜けているのかもしれません、僕も現在進行形で調べはしていますが、教えていただきたいです！！
