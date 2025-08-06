'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ExternalLink, Search, X } from 'lucide-react';
import { Offer } from '@/types/offers';
import { useOffers } from '@/hooks/use-offers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const OffersTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updatedAt', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { offers, error } = useOffers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchQuery,
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getPayoutModelBadgeVariant = (model: string) => {
    switch (model) {
      case 'CPA':
        return 'primary';
      case 'CPL':
        return 'info';
      case 'CPI':
        return 'secondary';
      case 'CPC':
        return 'destructive';
      default:
        return 'primary';
    }
  };

  const columns = useMemo<ColumnDef<Offer>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: row => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 48,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'offerId',
        accessorFn: row => row.offerId,
        header: ({ column }) => (
          <DataGridColumnHeader title="Offer ID" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm text-mono">
            {row.original.offerId}
          </span>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-4 w-[80px]" />,
        },
      },
      {
        id: 'offerName',
        accessorFn: row => row.offerName,
        header: ({ column }) => (
          <DataGridColumnHeader title="Offer Name" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span className="leading-none font-medium text-sm text-mono hover:text-primary">
              {row.original.offerName}
            </span>
            <span className="text-xs text-secondary-foreground">
              {row.original.flow}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          skeleton: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          ),
        },
      },
      {
        id: 'landingPage',
        accessorFn: row => row.landingPage,
        header: ({ column }) => (
          <DataGridColumnHeader title="Landing Page" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-foreground truncate max-w-[120px]">
              {row.original.landingPage}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(row.original.landingPage, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        ),
        enableSorting: true,
        size: 160,
        meta: {
          skeleton: <Skeleton className="h-4 w-[120px]" />,
        },
      },
      {
        id: 'mobileOperator',
        accessorFn: row => row.mobileOperator,
        header: ({ column }) => (
          <DataGridColumnHeader title="Mobile Operator" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.mobileOperator}</span>
        ),
        enableSorting: true,
        size: 130,
        meta: {
          skeleton: <Skeleton className="h-4 w-[80px]" />,
        },
      },
      {
        id: 'payout',
        accessorFn: row => row.payout,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payout" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">
            ${row.original.payout.toFixed(2)}
          </span>
        ),
        enableSorting: true,
        size: 80,
        meta: {
          skeleton: <Skeleton className="h-4 w-[60px]" />,
        },
      },
      {
        id: 'offerAvailability',
        accessorFn: row => row.offerAvailability,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <Badge
            variant={getStatusBadgeVariant(row.original.offerAvailability)}
          >
            {row.original.offerAvailability}
          </Badge>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-5 w-[60px]" />,
        },
      },
      {
        id: 'landingPageLanguage',
        accessorFn: row => row.landingPageLanguage,
        header: ({ column }) => (
          <DataGridColumnHeader title="Language" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.landingPageLanguage}</span>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-4 w-[70px]" />,
        },
      },
      {
        id: 'payoutModel',
        accessorFn: row => row.payoutModel,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payout Model" column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant={getPayoutModelBadgeVariant(row.original.payoutModel)}>
            {row.original.payoutModel}
          </Badge>
        ),
        enableSorting: true,
        size: 110,
        meta: {
          skeleton: <Skeleton className="h-5 w-[50px]" />,
        },
      },
      {
        id: 'connectionType',
        accessorFn: row => row.connectionType,
        header: ({ column }) => (
          <DataGridColumnHeader title="Connection" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm capitalize">
            {row.original.connectionType}
          </span>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-4 w-[60px]" />,
        },
      },
      {
        id: 'restriction',
        accessorFn: row => row.restriction,
        header: ({ column }) => (
          <DataGridColumnHeader title="Restriction" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-secondary-foreground">
            {row.original.restriction}
          </span>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-4 w-[80px]" />,
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: offers,
    pageCount: Math.ceil((offers?.length || 0) / pagination.pageSize),
    getRowId: (row: Offer) => String(row.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <div className="p-4 text-center text-red-600">{error}</div>
      </Card>
    );
  }

  return (
    <DataGrid
      table={table}
      recordCount={offers?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader className="py-3.5">
          <CardTitle>Offers Management</CardTitle>
          <CardToolbar className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ps-9 w-40"
            />
            {searchQuery.length > 0 && (
              <Button
                mode="icon"
                variant="ghost"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X />
              </Button>
            )}
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
};

export { OffersTable };
