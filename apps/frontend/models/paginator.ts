export default class Paginator<T> {
  public total: number;
  public perPage: number;
  public page: number;
  public pages: number;
  public rows: T[];

  constructor(data: { total: number; perPage: number; page: number; pages: number; rows: T[] }) {
    this.total = data.total;
    this.perPage = data.perPage;
    this.page = data.page;
    this.pages = data.pages;
    this.rows = data.rows;
  }
}
