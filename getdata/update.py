#increment data version to get newer data. data version is number of races
import json
import urllib.request

dataversion=22

responseRaw = urllib.request.urlopen(f"https://fantasy.formula1.com/feeds/drivers/{dataversion}_en.json").read()
response = json.loads(responseRaw)


data = response['Data']['Value']
driverData = []
constructorData = []

for e in data:
    if e['PositionName'] == "CONSTRUCTOR":
        constructorData.append(e)
    if e['PositionName'] == "DRIVER":
        driverData.append(e)

cf = open('constructors.json', 'w')
cf.write('[')
for i in range(len(constructorData)):
    c = constructorData[i]
    if c['IsActive'] != '1':
        continue
    cf.write('{"id":"'+c['PlayerId']+'", "name":"'+c['FUllName']+'", "cost":'+str(c['Value'])+',"active":'+c['IsActive']+'}')
    if i < len(constructorData)-1:
        cf.write(',')
cf.write(']')
cf.close()

df = open('drivers.json', 'w')
df.write('[')
for i in range(len(driverData)):
    d = driverData[i]
    df.write('{"id":"'+d['PlayerId']+'", "name":"'+d['FUllName']+'", "cost":'+str(d['Value'])+', "team":"'+d['TeamName']+'", "teamid":"'+d['TeamId']+'", "active":'+d['IsActive']+'}')
    if i < len(driverData)-1:
        df.write(',')
df.write(']')
df.close()

lastupdatefile = open('lastupdate.txt', 'w')
lastupdatefile.write(f"Version: {dataversion}. Time: "+response["Meta"]["Timestamp"]["UTCTime"]+" (UTC).")
lastupdatefile.close()

