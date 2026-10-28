// Demo screen — built by the agent using only @acme/ui exports (see AGENTS.md).
// Components used: Page, Stack, Cluster, Card, Text, Button, Badge.
import { useState } from 'react';
import { Page, Stack, Cluster, Card, Text, Button, Badge } from '../index';
import type { BadgeProps } from '../index';

type Quality = 'measured' | 'estimated';
type RequestStatus = 'not-requested' | 'sent' | 'replied';
interface Supplier { id: string; name: string; category: string; emissions: number; quality: Quality; requested?: boolean }

// Status → Badge tone, following the tone meanings in DESIGN.md and the Badge docs.
const QUALITY: Record<Quality, { tone: BadgeProps['tone']; label: string }> = {
  measured: { tone: 'success', label: 'Measured data' },
  estimated: { tone: 'warning', label: 'Estimated data' },
};
const REQUEST: Record<RequestStatus, { tone: BadgeProps['tone']; label: string }> = {
  'not-requested': { tone: 'neutral', label: 'Not requested' },
  sent: { tone: 'neutral', label: 'Request sent' },
  replied: { tone: 'success', label: 'Supplier replied' },
};

const SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Northfield Steel', category: 'Metals', emissions: 1240, quality: 'measured' },
  { id: '2', name: 'Blue Freight', category: 'Logistics', emissions: 860, quality: 'estimated' },
  { id: '3', name: 'Greenfield Pack', category: 'Packaging', emissions: 312, quality: 'estimated' },
];

export function SupplierRequests() {
  const [suppliers, setSuppliers] = useState(SUPPLIERS);
  const [sending, setSending] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  // Suppliers that have replied to a data request, in the order they replied.
  const [replies, setReplies] = useState<string[]>(['Northfield Steel']);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
  };

  const request = (id: string) => {
    setSending(id);
    setTimeout(() => {
      setSuppliers(s => s.map(x => (x.id === id ? { ...x, requested: true } : x)));
      setSending(null);
    }, 900);
    // Demo only: simulate the supplier replying a little later.
    const name = suppliers.find(x => x.id === id)?.name;
    if (name) setTimeout(() => setReplies(r => (r.includes(name) ? r : [...r, name])), 3000);
  };

  const requestStatus = (s: Supplier): RequestStatus =>
    replies.includes(s.name) ? 'replied' : s.requested ? 'sent' : 'not-requested';

  const estimated = suppliers.filter(s => s.quality === 'estimated');
  const total = suppliers.reduce((sum, s) => sum + s.emissions, 0);

  return (
    <Page>
      <Stack gap="section">
        <Stack gap="compact">
          <Cluster gap="default">
            <Text variant="heading-medium" as="h1">Supplier data requests</Text>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {dark ? 'Switch to light' : 'Switch to dark'}
            </Button>
          </Cluster>
          <Text tone="muted">
            Replace estimates with measured data by asking suppliers for their figures.
          </Text>
        </Stack>

        <Card>
          <Stack gap="compact">
            <Text variant="label-small" tone="muted">Total supplier emissions · Q3</Text>
            <Text variant="heading-medium">{total.toLocaleString()} tCO2e</Text>
            <Text tone="warning">
              {estimated.length} of {suppliers.length} suppliers are estimated. Request measured data to improve accuracy.
            </Text>
          </Stack>
        </Card>

        <Stack gap="default" as="ul" aria-label="Suppliers">
          {suppliers.map(s => (
            <Card as="li" key={s.id}>
              <Stack gap="default">
                <Stack gap="compact">
                  <Text variant="label-large" as="h2">{s.name}</Text>
                  {/* Rule: estimated values must be labelled, never shown as if measured. */}
                  <Cluster gap="compact">
                    <Badge tone={QUALITY[s.quality].tone}>{QUALITY[s.quality].label}</Badge>
                    <Badge tone={REQUEST[requestStatus(s)].tone}>{REQUEST[requestStatus(s)].label}</Badge>
                  </Cluster>
                  <Text tone="muted">
                    {s.category} · {s.emissions.toLocaleString()} tCO2e · Q3
                    {s.quality === 'estimated' && ' · from spend data'}
                  </Text>
                </Stack>
                <Cluster gap="compact">
                  {s.quality === 'estimated' && !s.requested && (
                    <Button size="sm" loading={sending === s.id} onClick={() => request(s.id)}>
                      {sending === s.id ? 'Sending' : 'Request data'}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">View supplier</Button>
                </Cluster>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Card>
          <Stack gap="default">
            <Stack gap="compact">
              <Text variant="label-large" as="h2">Supplier replies</Text>
              <Text variant="heading-medium" as="p">{replies.length}</Text>
            </Stack>
            {replies.length > 0 ? (
              <Stack gap="compact" as="ol" aria-label="Suppliers that replied, in reply order">
                {replies.map(name => (
                  <Text as="li" key={name}>{name}</Text>
                ))}
              </Stack>
            ) : (
              <Text tone="muted">No replies yet. Suppliers appear here once they respond.</Text>
            )}
            <Cluster gap="compact">
              <Button size="sm" variant="ghost" disabled={replies.length === 0} onClick={() => setReplies([])}>
                Clear replies
              </Button>
            </Cluster>
          </Stack>
        </Card>
      </Stack>
    </Page>
  );
}
