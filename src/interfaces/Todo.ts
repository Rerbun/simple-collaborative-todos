export class Todo {
	public id?: string;
	public parent?: Todo;
	public children: Todo[] = [];
	public status: 'unchecked' | 'checked' | 'rejected' = 'unchecked';
	public title: string = '';

	constructor(title?: string) {
		this.title = title ?? this.title;
	}

	clone(): Todo {
		return Object.assign(new Todo(), this);
	}
}
