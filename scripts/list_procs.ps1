Get-Process node | ForEach-Object {
    $proc = $_
    $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId = $($proc.Id)").CommandLine
    Write-Output "PID: $($proc.Id) | CMD: $cmd"
}

