import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'

async function getLeads() {
  const leads = await db.lead.findMany({
    include: {
      property: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return leads
}

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Leads</h1>
        <p className="text-muted-foreground">
          Todos os contatos recebidos pelo site
        </p>
      </div>

      {leads.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{lead.name}</CardTitle>
                    <CardDescription>
                      {lead.email && <span>{lead.email}</span>}
                      {lead.email && lead.phone && <span> • </span>}
                      {lead.phone && <span>{lead.phone}</span>}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {lead.property && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Interesse em:{' '}
                    </span>
                    <a
                      href={`/imoveis/${lead.property.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {lead.property.title}
                    </a>
                  </div>
                )}
                {lead.message && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Mensagem:
                    </p>
                    <p className="text-sm">{lead.message}</p>
                  </div>
                )}
                {lead.utm && (
                  <div className="text-xs text-muted-foreground">
                    <span>Origem: </span>
                    <code className="bg-muted px-2 py-1 rounded">
                      {JSON.stringify(lead.utm)}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum lead recebido ainda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

