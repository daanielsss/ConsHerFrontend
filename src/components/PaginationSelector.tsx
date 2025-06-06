import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination";

type Props = {
    page: number;
    pages: number;
    onPageChane: (page: number) => void;
};

export default function PaginationSelector({ page, pages, onPageChane }: Props) {
    const pageNumbers: number[] = [];
    for (let i = 1; i < pages; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                {page !== 1 && (
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => onPageChane(page - 1)} />
                    </PaginationItem>
                )}

                {pageNumbers.map((number, key) => (
                    <PaginationItem key={key}>
                        <PaginationLink
                            href="#"
                            onClick={() => onPageChane(number)}
                            isActive={page === number}
                        >
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {page !== pageNumbers.length && (
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => onPageChane(page + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
