export class Todo {
	public id?: string = crypto.randomUUID();
	public parent?: Todo;
	public children: Todo[] = [];
	public status: 'unchecked' | 'checked' = 'unchecked';
	public title: string = '';

	constructor(title?: string) {
		this.title = title ?? this.title;
	}

	clone(): Todo {
		return Object.assign(new Todo(), this);
	}

	static fromObject(object: Record<string, any>): Todo {
		return Object.assign(new Todo(), object);
	}
}
