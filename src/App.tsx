function App() {
  return (
    <div className="mx-auto max-w-md p-4">
      <div className="rounded-2xl bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground">Grand Filano</h1>
        <div className="mt-4 grid grid-cols-2 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Make</p>
            <p className="text-sm font-medium text-foreground">Yamaha</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Year</p>
            <p className="text-sm font-medium text-foreground">2025</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Color</p>
            <p className="text-sm font-medium text-foreground">Casual Navy</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Chassis No.</p>
            <p className="text-sm font-medium text-foreground">ME1SG4310P0123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
