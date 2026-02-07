export const metadata = {
    title: "Hello Vishal"
  }
  
  export default function ProfilePage() {
    return (
      <div>
        <div>
          <input type="text" placeholder="Job Title"  className="w-full p-2 border rounded" />
          <input type="text" placeholder="Location"  className="w-full p-2 border rounded"/>
          <input type="text" placeholder="Current Company"  className="w-full p-2 border rounded" />
        </div>
      </div>
    )
  }