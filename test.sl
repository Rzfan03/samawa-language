# Test semua keyword SamaLang

# Variable declaration
ada nama = "SamaLang"
ada versi = 2.0
ada aktif = true

# Print
tulis("Halo, " .. nama .. " v" .. tostring(versi))

# Simple if
lamen aktif tres
    tulis("Aktif!")
jure_mo

# If-else
lamen versi > 1.0 tres
    tulis("Versi baru")
lamen_no
    tulis("Versi lama")
jure_mo

# If-elseif-else
ada nilai = 85

lamen nilai >= 90 tres
    tulis("A")
lamen_no_kebali nilai >= 80 tres
    tulis("B")
lamen_no_kebali nilai >= 70 tres
    tulis("C")
lamen_no
    tulis("D")
jure_mo

# Function
fungsi tambah(a, b)
    semalik a + b
jure_mo

fungsi faktorial(n)
    lamen n <= 1 tres
        semalik 1
   jure_mo
    semalik n * faktorial(n - 1)
jure_mo

tulis("3 + 5 = " .. tostring(tambah(3, 5)))
tulis("5! = " .. tostring(faktorial(5)))

# While loop (selama)
ada i = 1
selama i <= 5 boat
    tulis("selama: " .. tostring(i))
    i = i + 1
jure_mo

# While loop (untu)
ada j = 1
untu j <= 5 boat
    tulis("untu: " .. tostring(j))
    j = j + 1
jure_mo

# For loop
untuk k = 1, 5 boat
    tulis("for: " .. tostring(k))
jure_mo

# Repeat-until
ada x = 1
ulang
    tulis("repeat: " .. tostring(x))
    x = x + 1
sampe x > 5

# Break
untuk n = 1, 10 boat
    lamen n == 3 tres
        jangka_mo
   jure_mo
    tulis("break test: " .. tostring(n))
jure_mo

# Nil
ada data = nda_isi
lamen data == nda_isi tres
    tulis("Data kosong")
jure_mo

# Not
ada kosong = siong
lamen no kosong tres
    tulis("Tidak kosong")
jure_mo

# True and False (tutu / siong)
ada benar = tutu
ada salah = siong
lamen benar == tutu tres
    tulis("Benar adalah tutu")
jure_mo
lamen salah == siong tres
    tulis("Salah adalah siong")
jure_mo

# And (dan)
ada a = tutu
ada b = tutu
lamen a dan b tres
    tulis("a dan b keduanya tutu")
jure_mo

# Or (atau)
ada c = siong
ada d = tutu
lamen c atau d tres
    tulis("Salah atau Benar = tutu")
jure_mo

# Require (kenang)
ada string = kenang('string')
tulis(string.upper("hello"))

# Goto (lalo)
untuk i = 1, 5 boat
    lamen i == 3 tres
        lalo skip
   jure_mo
    tulis("ini akan dilewati: " .. tostring(i))
    ::skip::
jure_mo

# String in string (should not replace keywords inside)
tulis("lamen tres jure_mo")
tulis("fungsi returns ada")

tulis("Semua test selesai!")
