export interface PaginationServiceProps {
  perPage: number;
  page: number;
  itemsCount: number;
}

export class PaginationService {
  readonly #maxPage;
  readonly #page;
  readonly #perPage;
  readonly #itemsCount;
  constructor({ perPage, page, itemsCount }: PaginationServiceProps) {
    this.#itemsCount = itemsCount;
    this.#perPage = perPage;
    this.#maxPage = this.#getMaxPage(this.#itemsCount, this.#perPage);
    this.#page = this.#getValidPage(page, this.#maxPage);
  }
  getPaginationParams(): { skip: number; take: number } {
    return {
      skip: (this.#page - 1) * this.#perPage,
      take: this.#perPage,
    };
  }
  getPaginationResult(): {
    page: number;
    maxPage: number;
    perPage: number;
    itemsCount: number;
  } {
    return {
      maxPage: this.#maxPage,
      page: this.#page,
      perPage: this.#perPage,
      itemsCount: this.#itemsCount,
    };
  }
  #getMaxPage(elementsCount: number, perPage: number): number {
    const maxPage = Math.ceil((elementsCount || 1) / perPage);
    return maxPage;
  }
  #getValidPage(page: number, maxPage: number) {
    if (page < 1) {
      return 1;
    }
    if (page > maxPage) {
      return maxPage;
    }
    return page;
  }
}
