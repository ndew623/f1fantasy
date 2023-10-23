#https://fantasy.formula1.com/feeds/drivers/17_en.json
import urllib.request
import json

#constructors
constructorsResponseRaw = urllib.request.urlopen('https://fantasy.formula1.com/feeds/statistics/constructors.json').read()
constructorsResponse = json.loads(constructorsResponseRaw)

cf = open('constructors.json', 'w')

constructorData = constructorsResponse['Data'][0]['participants']

cf.write('[')
for i in range(len(constructorData)):
    p = constructorData[i]
    cf.write('{"id":"'+p['playerid']+'", "name":"'+p['teamname']+'", "cost":'+str(p['curvalue'])+'}')
    if i < len(constructorData)-1:
        cf.write(',')
cf.write(']')

cf.close()



#drivers
driversResponseRaw = urllib.request.urlopen('https://fantasy.formula1.com/feeds/statistics/drivers.json').read()
driversResponse = json.loads(driversResponseRaw)

df = open('drivers.json', 'w')

driversData = driversResponse['Data'][0]['participants']

df.write('[')
for i in range(len(driversData)):
    p = driversData[i]
    df.write('{"id":"'+p['playerid']+'", "name":"'+p['playername']+'", "cost":'+str(p['curvalue'])+', "team":"'+p['teamname']+'", "teamid":"'+p['teamid']+'"}')
    if i < len(driversData)-1:
        df.write(',')
df.write(']')

df.close()

