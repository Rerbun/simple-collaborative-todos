export class Todo {
	public id?: string;
	public parent?: Todo;
	public children: Todo[] = [];
	public status: 'unchecked' | 'checked' | 'rejected' = 'unchecked';
	public title: string = '';

	constructor(title?: string) {
		this.title = title ?? this.title;
	}

	public addChild(title: string) {
		const newTodo = new Todo(title);
		newTodo.parent = this;
		this.children.push(newTodo);
	}

	// copy(todo: Todo) {
	// 	const copy = new Todo();
	// 	copy.id = todo.id;
	// 	copy.parent = todo.parent;

	// }
}
