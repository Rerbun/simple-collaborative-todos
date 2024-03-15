export class Todo {
  public readonly id: string;
  public readonly parent?: Todo;
  public children: Todo[] = [];
  public status: 'unchecked' | 'checked' = 'unchecked';
  public title: string = '';

  constructor(title?: string, parent?: Todo) {
    this.title = title ?? this.title;
    this.parent = parent;
    this.id = parent?.id ?? crypto.randomUUID();
  }

  clone(): Todo {
    return Object.assign(new Todo(), this);
  }

  static fromObject(object: Record<string, any>): Todo {
    return Object.assign(new Todo(), object);
  }
}
