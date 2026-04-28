"use client"
import { useState, useEffect, useRef } from "react"
import { getProducts, saveProducts, CATEGORIES, Product } from "../lib/products"

const PASS  = "haweyah2026"
const EMPTY = {
  name:"", category:CATEGORIES[0], price:"", unit:"",
  image:"", badge:"", description:"", minOrder:""
}

export default function Dashboard() {
  const [authed,   setAuthed]   = useState(false)
  const [pass,     setPass]     = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Product | null>(null)
  const [form,     setForm]     = useState(EMPTY)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (authed) setProducts(getProducts()) }, [authed])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    pass === PASS ? setAuthed(true) : alert("كلمة المرور غير صحيحة")
  }

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, category: p.category, price: p.price, unit: p.unit,
      image: p.image || "", badge: p.badge || "", description: p.description || "", minOrder: p.minOrder || ""
    })
    setShowForm(true)
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({...f, image: reader.result as string}))
    reader.readAsDataURL(file)
  }

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault()
    const updated = editing
      ? products.map(p => p.id === editing.id ? { ...p, ...form } : p)
      : [...products, { ...form, id: Date.now().toString() }]
    saveProducts(updated); setProducts(updated); setShowForm(false)
  }

  const del = (id: string) => {
    if (!confirm("حذف المنتج؟")) return
    const updated = products.filter(p => p.id !== id)
    saveProducts(updated); setProducts(updated)
  }

  if (!authed) return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white rounded-2xl p-8 shadow-lg w-80">
        <div className="text-4xl text-center mb-4">🔐</div>
        <h1 className="text-xl font-extrabold text-gray-900 text-center mb-6">لوحة التحكم — حاوية</h1>
        <form onSubmit={login} className="space-y-4">
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
          <button type="submit"
            className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors">
            دخول
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-green-700 text-sm no-underline">← الرئيسية</a>
          <h1 className="text-xl font-extrabold text-green-800">⚙️ لوحة التحكم — حاوية</h1>
        </div>
        <button onClick={openAdd}
          className="bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
          + إضافة منتج
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg font-bold text-gray-500 mb-2">لا توجد منتجات بعد</p>
            <p className="text-sm mb-6">ابدأ بإضافة أول منتج لمنصة حاوية</p>
            <button onClick={openAdd}
              className="bg-green-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors">
              + إضافة أول منتج
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{products.length} منتج</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["الصورة","المنتج","القسم","السعر","أقل طلب","البادج",""].map(h => (
                      <th key={h} className="text-right px-4 py-3 font-bold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                          : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">لا صورة</div>
                        }
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.category}</td>
                      <td className="px-4 py-3 font-bold text-green-700">{p.price} ﷼</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.minOrder || "—"}</td>
                      <td className="px-4 py-3">
                        {p.badge && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs font-bold">تعديل</button>
                          <button onClick={() => del(p.id)} className="text-red-500 hover:underline text-xs font-bold">حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="font-extrabold text-gray-900 mb-5 text-lg">
              {editing ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
            </h2>
            <form onSubmit={saveForm} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">صورة المنتج</label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-500 transition-colors">
                  {form.image ? (
                    <img src={form.image} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                  ) : (
                    <div className="text-gray-400">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-xs">اضغط لرفع صورة المنتج</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                {form.image && (
                  <button type="button" onClick={() => setForm(f => ({...f, image:""}))}
                    className="text-xs text-red-500 mt-1 hover:underline">
                    حذف الصورة
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">اسم المنتج *</label>
                <input required value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                  placeholder="مثال: زيت نباتي مكرر"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">القسم *</label>
                  <select required value={form.category} onChange={e => setForm({...form, category:e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">السعر (ريال) *</label>
                  <input required type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})}
                    placeholder="185"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">الوحدة *</label>
                  <input required value={form.unit} onChange={e => setForm({...form, unit:e.target.value})}
                    placeholder="كيس 50 كيلو"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">أقل كمية للطلب *</label>
                  <input required value={form.minOrder} onChange={e => setForm({...form, minOrder:e.target.value})}
                    placeholder="10 كراتين"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">البادج (اختياري)</label>
                <input value={form.badge} onChange={e => setForm({...form, badge:e.target.value})}
                  placeholder="عرض / جديد / تصفية / ستوك"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">وصف المنتج (لقوقل)</label>
                <input value={form.description} onChange={e => setForm({...form, description:e.target.value})}
                  placeholder="وصف مختصر للمنتج يظهر في نتائج البحث"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit"
                  className="flex-1 bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors">
                  {editing ? "حفظ التعديلات" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}