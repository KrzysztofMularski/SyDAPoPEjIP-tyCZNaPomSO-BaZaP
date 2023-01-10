import subprocess, sys
import os
import time

def main():
    cwd = os.getcwd()

    tekstRozkazu = cwd + "\CD_Open.ps1"
    tekstRozkazu2 = cwd + "\CD_Close.ps1"
    #start measuring time
    start = time.perf_counter()
    #open the CD drive
    p = subprocess.run(
        ["powershell.exe", 
        "-NoProfile", 
        "-ExecutionPolicy", "Bypass", 
        "-File",tekstRozkazu ], 
        capture_output=True, text=True
        )
    #after opening is complete, close the CD drive
    p = subprocess.run(
        ["powershell.exe", 
        "-NoProfile", 
        "-ExecutionPolicy", "Bypass", 
        "-File",tekstRozkazu2 ], 
        capture_output=True, text=True
        )
    #end time measurement
    end = time.perf_counter()
    # find elapsed time in seconds
    ms = (end-start) * 10**6
    print(ms)
    return ms



if __name__ == "__main__":
    ms2 = main()
    sys.exit()