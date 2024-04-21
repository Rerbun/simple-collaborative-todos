export class Todo {
  public readonly id: string;
  public readonly parent?: Todo;
  public children: Todo[] = [];
  public status: 'unchecked' | 'checked' = 'unchecked';
  public title: string = '';
  private _publishId?: string;

  get publishId(): string {
    return this._publishId;
  }

  set publishId(value: string) {
    this._publishId = value;
    this.children.forEach((child) => (child.publishId = value));
  }

  get isInstance(): boolean {
    return this instanceof Todo && (!this.parent || this.parent.isInstance);
  }

  private static getApicalParent(todo: Record<string, any>): Todo | Record<string, any> {
    let { parent } = todo;
    while (parent?.parent) {
      parent = parent.parent;
    }
    return parent ?? todo;
  }

  public getApicalParent(): Todo | Record<string, any> {
    return Todo.getApicalParent(this);
  }

  // public getPublishedAncestorId(): string {
  //   if (this.publishId) {
  //     return this.parent
  //       ? Todo.fromObject(this.parent)?.getPublishedAncestorId() ?? this.id
  //       : this.id;
  //   }
  //   return undefined;
  // }

  constructor(title?: string, parent?: Todo) {
    this.title = (title ?? this.title)?.trim();
    this.parent = parent;
    this.id = crypto.randomUUID();
  }

  clone(): Todo {
    return Object.assign(new Todo(), this);
  }

  // TODO: Rename descendent to descendant
  public findDescendentById(id: string): Todo {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.findDescendentById(id);
      if (found) return found;
    }
    return undefined;
  }

  public static fromObject(object: Record<string, any>): Todo {
    // if (object.parent) object.parent = Todo.fromObject(object.parent);
    const apicalIntance = Object.assign(new Todo(), Todo.getApicalParent(object));
    apicalIntance.children = Todo.convertChildrenToInstances(apicalIntance.children, apicalIntance);
    return apicalIntance.findDescendentById(object.id);

    // const instance = Object.assign(new Todo(), { ...object, parent: parentReference });
    // instance.children = object.children?.map((child: Record<string, any>) =>
    //   Todo.fromObject(child, instance)
    // );
    // return instance;
  }

  private static convertChildrenToInstances(children: Record<string, any>[], parent: Todo): Todo[] {
    return children.map((child) => {
      const childInstance = Object.assign(new Todo(), {
        ...child,
        parent,
      });
      childInstance.children = Todo.convertChildrenToInstances(child.children, childInstance);
      return childInstance;
    });
  }
}
