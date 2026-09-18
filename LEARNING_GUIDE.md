# Calories App — personal learning guide

Šis fails ir mana personīgā rokasgrāmata šī projekta veidošanai. Projekta lietotāja interfeiss būs angļu valodā, bet šeit skaidrojumi ir latviski.

## Projekta mērķis

Izveidot Calories App, kur var:

1. ievadīt ēdiena nosaukumu;
2. ievadīt kaloriju skaitu;
3. pievienot maltīti;
4. redzēt šodien kopā apēstās kalorijas;
5. vēlāk nofotografēt ēdienu un saņemt aptuvenu AI kaloriju aprēķinu.

Ilgtermiņā tajā pašā aplikācijā varētu būt arī kopīgs ģimenes budžets tev un sievai.

## Tehnoloģijas

- **JavaScript** — programmēšanas valoda.
- **React** — JavaScript bibliotēka interaktīvām lietotāja saskarnēm.
- **Vite** — izstrādes serveris un projekta būvēšanas rīks.
- **ESLint** — pārbauda kodu un atrod biežas kļūdas.
- **Git** — saglabā projekta versijas lokāli.
- **GitHub** — glabā Git versijas internetā.

## Projekta plūsma

```text
index.html
    ↓
src/main.jsx
    ↓
src/App.jsx
    ↓
browser
```

- `index.html` ir sākotnējā HTML lapa ar `#root` elementu.
- `src/main.jsx` pieslēdz React aplikāciju `#root` elementam.
- `src/App.jsx` ir galvenais React komponents.
- `src/App.css` satur App komponenta stilus.
- `src/index.css` satur globālos stilus.

## Terminal komandas

### Instalēt dependencies

```bash
npm install
```

Instalē pakotnes, kas norādītas `package.json` failā.

### Palaist development serveri

```bash
npm run dev
```

Palaiž lokālo aplikāciju, parasti adresē `http://localhost:5173/`.

Lai apturētu serveri, terminālī nospied `Ctrl + C`.

### Pārbaudīt kodu

```bash
npm run lint
```

Palaiž ESLint. Ja terminālis beidzas bez error ziņojumiem un atgriežas pie prompt, pārbaude ir veiksmīga.

### Git pārbaudes un saglabāšana

```bash
git status
```

Parāda, kuri faili ir izmainīti.

```bash
git diff
```

Parāda, kas tieši failos ir mainījies.

```bash
git add src/App.jsx index.html
```

Sagatavo konkrētos failus commitam.

```bash
git add .
```

Sagatavo visas izmaiņas pašreizējā mapē. Pirms tam pārbaudi `git status`, lai nejauši nepievienotu slepenus vai nevajadzīgus failus.

```bash
git commit -m "Describe the change"
```

Izveido lokālu projekta versiju ar saprotamu aprakstu.

```bash
git push
```

Nosūta jauno commit uz GitHub. Tā darbojas, jo `main` branch jau ir savienota ar `origin/main`.

```bash
git log --oneline -5
```

Parāda pēdējos piecus commitus īsā formā.

## Noderīgi VS Code shortcuti

- `Cmd + S` — saglabāt failu.
- `Cmd + P` — ātri atrast un atvērt failu.
- `Cmd + Shift + P` — atvērt Command Palette.
- `Ctrl + `` — atvērt vai aizvērt integrēto termināli.
- `Cmd + Shift + P` → `Developer: Reload Window` — pārlādēt VS Code logu.
- `Cmd + Z` — atsaukt pēdējo izmaiņu.
- `Shift + Option + F` — formatēt failu, ja formatter ir konfigurēts.

## React pamati, ko jau esam apguvuši

### Komponents

```jsx
function App()
{
  return (
    <main>
      <h1>Calories App</h1>
    </main>
  )
}
```

React komponents ir JavaScript funkcija, kas atgriež JSX. JSX izskatās līdzīgs HTML, bet atrodas JavaScript failā.

### `useState`

```jsx
const [totalCalories, setTotalCalories] = useState(0)
```

- `totalCalories` ir pašreizējā vērtība.
- `setTotalCalories` maina šo vērtību.
- `0` ir sākotnējā vērtība.
- Kad izmantojam setter funkciju, React pārzīmē komponentu ar jauno vērtību.

### Controlled input

```jsx
const [foodName, setFoodName] = useState('')

<input
  value={foodName}
  onChange={(event) => setFoodName(event.target.value)}
/>
```

React kontrolē input vērtību. Lietotājs raksta, `onChange` saņem jauno tekstu, un setter saglabā to state.

### Kaloriju filtrēšana

```jsx
const onlyDigits = event.target.value.replace(/\D/g, '')
```

- `\D` nozīmē jebkuru simbolu, kas nav cipars.
- `g` nozīmē meklēt visus šādus simbolus.
- `replace(..., '')` tos izdzēš.

Tāpēc kaloriju laukā paliek tikai cipari.

### Masīvs, objekts un `.map()`

```jsx
const [meals, setMeals] = useState([])

const newMeal = {
  id: Date.now(),
  name: foodName.trim(),
  calories
}

setMeals([...meals, newMeal])
```

`meals` ir masīvs, kurā glabājam visas maltītes. Katra maltīte ir objekts ar `id`, `name` un `calories` laukiem.

```jsx
<ul>
  {meals.map((meal) => (
    <li key={meal.id}>
      {meal.name} — {meal.calories} kcal
    </li>
  ))}
</ul>
```

`.map()` iziet cauri visām maltītēm un katrai izveido vienu `<li>` elementu. `key` palīdz React atšķirt saraksta elementus.

### Aprēķināta vērtība ar `.reduce()`

```jsx
const totalCalories = meals.reduce(
  (total, meal) => total + meal.calories,
  0
)
```

`meals` ir vienīgais galvenais datu avots. Kopējais kaloriju skaits tiek aprēķināts no tā, nevis glabāts atsevišķā state. Tas novērš situāciju, kur saraksts un total varētu kļūt nesinhronizēti pēc maltītes dzēšanas vai rediģēšanas.

### Dzēšana ar `.filter()`

```jsx
function handleDeleteMeal(mealId)
{
  const updatedMeals = meals.filter((meal) => meal.id !== mealId)
  setMeals(updatedMeals)
}
```

`.filter()` izveido jaunu masīvu, atstājot tikai elementus, kas atbilst nosacījumam. Šeit paliek visas maltītes, kuru `id` nav vienāds ar dzēšamās maltītes `id`.

```jsx
onClick={() => handleDeleteMeal(meal.id)}
```

Arrow function nodrošina, ka dzēšanas funkcija tiek palaista tikai pēc pogas klikšķa, nevis renderēšanas laikā.

### Datu saglabāšana ar `localStorage`

```jsx
const [meals, setMeals] = useState(() => {
  const savedMeals = localStorage.getItem('meals')

  return savedMeals ? JSON.parse(savedMeals) : []
})
```

`localStorage` glabā datus pārlūkā kā tekstu. `JSON.parse()` pārvērš saglabāto tekstu atpakaļ JavaScript masīvā. Ja iepriekš saglabātu datu nav, izmantojam tukšu masīvu.

```jsx
useEffect(() => {
  localStorage.setItem('meals', JSON.stringify(meals))
}, [meals])
```

`useEffect` izpilda saglabāšanas kodu katru reizi, kad `meals` mainās. `JSON.stringify()` pārvērš JavaScript masīvu tekstā, lai to varētu saglabāt `localStorage`.

Šie dati ir tikai konkrētajā pārlūkā un ierīcē. Tie vēl netiek sinhronizēti ar citu lietotāju telefonu.

### Maltītes rediģēšana

Rediģēšanas režīmu kontrolē atsevišķs state:

```jsx
const [editingMealId, setEditingMealId] = useState(null)
```

Ja `editingMealId` ir `null`, forma darbojas kā **Add Meal**. Ja tajā ir maltītes ID, forma darbojas kā **Edit** režīms un rāda **Save Changes** un **Cancel** pogas.

```jsx
const updatedMeals = meals.map((meal) => {
  if (meal.id !== editingMealId) return meal

  return {
    ...meal,
    name: foodName.trim(),
    calories
  }
})
```

`.map()` izveido jaunu masīvu. Visas citas maltītes paliek nemainītas, bet maltītei ar konkrēto ID tiek atjaunināts nosaukums un kaloriju skaits. `...meal` saglabā arī tās laukus, kurus nemainām, piemēram, `id` un `date`.

### Attēla izvēle ar File input

```jsx
const [foodImage, setFoodImage] = useState(null)
```

```jsx
<input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handleImageChange}
/>
```

`accept="image/*"` ierobežo izvēli līdz attēliem. `capture="environment"` mobilajā ierīcē var piedāvāt izmantot aizmugurējo kameru. `event.target.files?.[0]` paņem pirmo izvēlēto failu. Šajā posmā fails tiek glabāts tikai React state un netiek saglabāts `localStorage`, jo `File` objekts nav vienkārši saglabājams JSON formātā.

### Datumi un šodienas maltītes

```jsx
const today = getToday()
const todayMeals = meals.filter((meal) => meal.date === today)
```

Katrai jaunai maltītei pievienojam `date` lauku. Tad `todayMeals` satur tikai šodienas maltītes, un total tiek aprēķināts no `todayMeals`, nevis no visa vēsturiskā `meals` masīva.

QA laikā pārbaudām arī, ka total izmanto tieši filtrēto masīvu. Citādi sarakstā varētu būt tikai šodienas maltītes, bet kopējais skaitlis nejauši ietvertu arī citu dienu datus.

## Pašreizējā izstrādes gaita

- [x] Node.js, npm un Git uzstādīti.
- [x] React + Vite projekts izveidots.
- [x] ESLint izvēlēts un darbojas.
- [x] GitHub repository savienots.
- [x] Vite starter ekrāns aizvietots ar Calories App sākumu.
- [x] Pievienots kopējais kaloriju skaits.
- [x] Pievienots kaloriju input.
- [x] Pievienota kaloriju validācija.
- [x] Pievienots ēdiena nosaukuma state.
- [x] Pievienot ēdiena nosaukuma input un pārbaudīt Add Meal darbību.
- [x] Neļaut pievienot maltīti bez ēdiena nosaukuma vai derīga kaloriju skaita.
- [x] Saglabāt maltītes masīvā un parādīt sarakstā.
- [x] Aprēķināt kopējo skaitu no maltīšu masīva.
- [x] Pievienot maltītes dzēšanu ar `.filter()`.
- [x] Saglabāt datus `localStorage`.
- [x] Pievienot maltītēm lokālo datumu un rādīt tikai šodienas maltītes.
- [x] Migrēt vecās maltītes bez `date` lauka uz šodienas datumu.
- [x] Pievienot maltītes rediģēšanu ar Save Changes un Cancel.
- [x] Pievienot ēdiena attēla izvēli ar file input.
- [ ] Pievienot foto augšupielādi.
- [ ] Pievienot drošu servera funkciju OpenAI API izsaukumam.
- [ ] Pievienot login un sinhronizāciju ar datubāzi.

### Pēdējais QA

Add Meal funkcionalitāte darbojas: ēdiena nosaukums un kaloriju skaits tiek ievadīti atsevišķos controlled inputs, tukšs ēdiena nosaukums tiek noraidīts, kaloriju skaits tiek pieskaitīts kopējam totalam, un pēc veiksmīgas pievienošanas abi lauki tiek iztīrīti. Maltītes tiek saglabātas `meals` masīvā un parādītas ar `.map()`. Kopējais skaits tiek aprēķināts no `meals` ar `.reduce()`. Maltīti var izdzēst ar `.filter()`, un total pēc dzēšanas automātiski pārrēķinās. Maltītes saglabājas pēc refresh ar `localStorage`, `useEffect`, `JSON.stringify()` un `JSON.parse()`. Jaunām maltītēm tiek pievienots lokālais datums, saraksts filtrējas ar `todayMeals`, un total tiek rēķināts tikai no šodienas maltītēm. Vecām maltītēm bez datuma tiek pievienots šodienas datums ar migration loģiku. Maltītes var rediģēt, saglabājot to `id` un `date`, bet mainot `name` un `calories`. Ēdiena attēlu var izvēlēties ar File input, bet tas pagaidām netiek saglabāts vai sūtīts uz API. QA atrada un salaboja kļūdu, kur izvēlētais attēls palika formā pēc add/cancel. `npm run lint` iziet bez kļūdām.

## Drošības noteikums

OpenAI API key nekad nedrīkst likt React frontend kodā vai commitot GitHub. Vēlāk API izsaukumu veidosim serverī vai edge function, un atslēgu glabāsim environment variables.

## Mūsu darba metode

1. Veidojam vienu mazu funkcionalitāti vienlaikus.
2. Katrai izmaiņai saprotam, ko dara katra rinda.
3. Pārbaudām aplikāciju pārlūkā.
4. Palaižam `npm run lint`.
5. Tikai tad veidojam Git commit.
6. Ja kaut kas nesaprotams, vispirms mēģinām izskaidrot problēmu, nevis akli pārrakstām visu projektu.
