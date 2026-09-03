"""
Génère favicon.ico et apple-touch-icon.png à partir du monogramme « iC ».

    python3 scripts/generer-icones.py

Les deux fichiers sortent du même tracé : ils ne peuvent donc pas diverger.
Une version SVG a été écartée volontairement — son texte aurait dépendu de la
police du système, qui peut différer de celle figée ici, et l'icône de
l'onglet n'aurait alors pas été identique à celle des favoris.
"""

from PIL import Image, ImageDraw, ImageFont

COTE = 512
NUIT = (10, 15, 26, 255)      # --nuit
OS = (232, 225, 211, 255)     # --os
AMBRE = (244, 178, 102, 255)  # --ambre
POLICE = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

image = Image.new("RGBA", (COTE, COTE), (0, 0, 0, 0))
dessin = ImageDraw.Draw(image)

# Rayon proportionnel au côté, comme le `border-radius` des cartes du site.
dessin.rounded_rectangle(
    [0, 0, COTE - 1, COTE - 1], radius=int(COTE * 14 / 64), fill=NUIT
)

police = ImageFont.truetype(POLICE, int(COTE * 0.52))

# Les deux lettres sont mesurées ensemble pour centrer le bloc, puis dessinées
# séparément afin de leur donner deux couleurs.
largeur_i = dessin.textlength("i", font=police)
largeur_c = dessin.textlength("C", font=police)
boite = dessin.textbbox((0, 0), "iC", font=police)

x = (COTE - (largeur_i + largeur_c)) / 2
y = (COTE - (boite[3] - boite[1])) / 2 - boite[1]

dessin.text((x, y), "i", font=police, fill=OS)
dessin.text((x + largeur_i, y), "C", font=police, fill=AMBRE)

image.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon.png")
image.resize((256, 256), Image.LANCZOS).save(
    "public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
)

print("public/apple-touch-icon.png et public/favicon.ico régénérés")
