import { Building2, MapPin, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'

async function getStats() {
  const [totalProperties, publishedProperties, totalLeads, totalNeighborhoods] =
    await Promise.all([
      db.property.count(),
      db.property.count({ where: { published: true } }),
      db.lead.count(),
      db.neighborhood.count(),
    ])

  const recentLeads = await db.lead.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  })

  return {
    totalProperties,
    publishedProperties,
    totalLeads,
    totalNeighborhoods,
    recentLeads,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Gabriel Alberto Imóveis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedProperties} publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Total de contatos recebidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bairros</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNeighborhoods}</div>
            <p className="text-xs text-muted-foreground">
              Bairros cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProperties > 0
                ? ((stats.totalLeads / stats.totalProperties) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Leads por imóvel
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentLeads.length > 0 ? (
            <div className="space-y-4">
              {stats.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.email || lead.phone}
                    </p>
                    {lead.property && (
                      <p className="text-sm text-primary mt-1">
                        Interesse em: {lead.property.title}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum lead recebido ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

