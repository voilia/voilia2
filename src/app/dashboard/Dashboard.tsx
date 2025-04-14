import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/Overview";
import { RecentSales } from "@/components/RecentSales";
import { Search } from "@/components/Search";

export default function Dashboard() {
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s an overview of your account
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Search />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Last month revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Last month subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
              <CardDescription>Last month sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Now</CardTitle>
              <CardDescription>Realtime active users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
