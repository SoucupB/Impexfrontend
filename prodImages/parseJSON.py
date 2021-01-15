import json
import sys
JSON_PATH = "dateDB.json"

def usage():
    USAGE = """
    USAGE: python parseJSON.py option [params ...]

    Script care afiseaza informatii despre colectiile din DB
    
    Options
    -si or --short-info => Afiseaza numarul de colectii si numele acestora
    -cd or --collection-details [nume_colectie] => Afiseaza detalii despre colectia [nume_colectie]
    -i  or --inventory => Afiseaza sub forma de cheie: valoare, categoria si numarul de elemente din categoria respectiva
    
    -h  or --help => manual de instructiuni
    """
    print(USAGE)

def readJSON():
    with open(JSON_PATH, 'r') as infile:
        date = json.load(infile)
        return date
    return None

def printColectionsName(date):
    print("Total colectii: "+ str(len(date['colectii'])))
    for colectie in date['colectii']:
        print(colectie.get("colectie", "not found key"))

def colectionDetails(date, name):
    for colectie in date['colectii']:
        if colectie.get("colectie", "not found key")==name:
            print("colectie: "+(colectie.get("colectie", "not found key") if colectie.get("colectie", "not found key") else "null"))
            print("tip: "+(colectie.get("tip", "not found key") if colectie.get("tip", "not found key") else "null"))
            print("descriere: "+(colectie.get("descriere", "not found key") if colectie.get("descriere", "not found key") else "null"))
            print("imagini de prezentare: "+str(colectie.get("img", "not found key") if colectie.get("img", "not found key") else "null"))
            print("elemente: ")
            for i,elem in enumerate(colectie["elemente"]):
                print(str(i+1)+")")
                print("\tid: "+(elem.get("id", "not found key") if elem.get("id", "not found key") else "null"))
                print("\tcategorie: "+(elem.get("categorie", "not found key") if elem.get("categorie", "not found key") else "null"))
                print("\tculoare: "+(elem.get("culoare", "not found key") if elem.get("culoare", "not found key") else "null" ))
                print("\timg: "+(elem.get("img", "not found key") if elem.get("img", "not found key") else "null" ))
                print("\tdimensiuni: "+(elem.get("dimensiuni", "not found key") if elem.get("dimensiuni", "not found key") else "null" ))
                print("---------------------------------------")
            return
    print("""Nu exista """ +name+""" in colectii. 
    1) Verificati daca ati scris corect. 
    2) Verificati daca ati salvat JSON-ul cu colectii si acesta este in acelasi folder cu script-ul \"parseJSON.py\"
    3) Daca nu sunt cele doua variante de mai sus, adaugati-l 
    """)

def inventory(date):
    inventar = {}
    for colectie in date['colectii']:
        for elem in colectie["elemente"]:
            if 'categorie' in elem and elem['categorie']:
                if elem['categorie'] in inventar:
                    inventar[elem['categorie']]+=1
                else:
                    inventar[elem['categorie']]=1
            else:
                print("Element fara categorie gasit! "+colectie.get('colectie'))
    for k in inventar:
        print(k+": "+str(inventar[k]))

def main():
    date = readJSON()
    if date:
        if(len(sys.argv)<2):
            usage()
            return
        if(sys.argv[1]=='-si' or sys.argv[1]=='--short-info'):
            printColectionsName(date)
        elif(sys.argv[1]=='-i' or sys.argv[1]=='--inventory'):
            inventory(date)
        elif(len(sys.argv)==3):
            if((sys.argv[1]=='-cd' or sys.argv[1]=='--collection-details')):
                colectionDetails(date, sys.argv[2])
        else:
            usage()
    else:
        print("""
        Nu s-a gasit JSON-u... Mai pe romaneste, nu s-au gasit datele.
        1) Asigurati-va ca scriptul "parseJSON.py" e in acelasi folder cu datele
        2) Asigurati-va ca aveti setat in script JSON_PATH pe json-ul bun
        3) Dupa ce ati rezolvat problema, rulati, din folderul corespunzator cu python parseJSON.py -h pentru a vedea manualul de instructiuni
        """)

if __name__ == "__main__":
    main()