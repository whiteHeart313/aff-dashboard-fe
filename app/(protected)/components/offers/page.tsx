'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { OffersTable } from '@/components/offers/offers-table';

export default function OffersPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <div className="flex flex-wrap items-center gap-2 font-medium">
                <span className="text-sm text-secondary-foreground">
                  Manage your offers and campaigns
                </span>
              </div>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">
                <Link href="/offers/create">Create New Offer</Link>
              </Button>
              <Button>
                <Link href="/offers/import">Import Offers</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <OffersTable />
      </Container>
    </Fragment>
  );
}